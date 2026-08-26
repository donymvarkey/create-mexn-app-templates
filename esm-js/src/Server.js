'use strict';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'node:http';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { serve, setup } from 'swagger-ui-express';
import mongoose from 'mongoose';
import { connectMongodb } from './database/databaseService.js';
import { swaggerSpec } from './config/swagger.js';
import { initRateLimiter } from './config/rateLimiter.js';

// Import Routes & Middlewares
import healthRoute from './routes/healthRoute.js';
import rateLimit from './middlewares/rateLimit.js';
import logger from './utils/logger.js';
import { NOT_FOUND } from './constants/responseMessages.js';
import httpError from './utils/httpError.js';
import globalErrorhandler from './middlewares/globalErrorHandler.js';

class Server {
  constructor(options) {
    this.options = options;
    this.api = null;
    this.httpServer = null;
  }

  async configServer() {
    const api = express();
    const httpServer = createServer(api);

    api.use(urlencoded({ limit: '10mb', extended: true }));
    api.use(json({ limit: '10mb' }));
    api.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );
    api.use(morgan('dev'));
    api.set('x-powered-by', false);
    api.use(helmet());
    api.use(xss());
    api.use(mongoSanitize());
    api.use(hpp());
    api.set('trust proxy', 1);
    api.use(rateLimit);

    this.api = api;
    this.httpServer = httpServer;

    return true;
  }

  async mountRoutes() {
    this.api.use('/api/v1/health', healthRoute);

    // Swagger Setup
    this.api.use('/api/docs', serve, setup(swaggerSpec));
    return true;
  }

  async startServer() {
    await this.configServer();
    await this.mountRoutes();

    // Handling 404 for unknown API endpoints
    this.api.use((req, res, next) => {
      try {
        throw new Error(NOT_FOUND('route'));
      } catch (error) {
        httpError(next, error, req, 404);
      }
    });

    // Global error handler
    this.api.use(globalErrorhandler);

    try {
      // Connect to database before listening
      if (this.options.db_url) {
        const connection = await connectMongodb(this.options.db_url);
        if (connection) {
          initRateLimiter(connection);
          logger.info('RATE_LIMITER_INITIATED');
        }
      }

      // Start server
      this.httpServer.listen(this.options.port, () => {
        logger.info('APPLICATION_STARTED', {
          meta: {
            PORT: this.options.port,
            SERVER_URL: this.options.server_url,
          },
        });
        logger.info('SWAGGER_STARTED ', {
          meta: { url: `${this.options.server_url}/api/docs` },
        });
      });

      // Handle user interrupts eg: CTRL+C, SIGTERM
      let isShuttingDown = false;
      const shutdown = (signal) => {
        if (isShuttingDown) {return;}
        isShuttingDown = true;

        logger.info('RECEIVED SIGNAL', {
          meta: {
            signal: signal,
          },
        });

        // Force close server after 5 seconds
        const forceTimeout = setTimeout(() => {
          logger.error(
            'Could not close connections in time, forcefully shutting down',
          );
          process.exit(1);
        }, 5000);

        this.httpServer.close(async () => {
          try {
            if (mongoose.connection.readyState === 1) {
              await mongoose.connection.close();
              logger.info('Database connection closed.');
            }
            clearTimeout(forceTimeout);
            logger.info('Shutting down server gracefully!');
            process.exit(0);
          } catch (err) {
            logger.error('Error during database teardown', {
              meta: { error: err },
            });
            process.exit(1);
          }
        });
      };

      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
      logger.error('APPLICATION_ERROR:', { meta: error });
      process.exit(1);
    }
  }
}

export default Server;
