'use strict';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'node:http';
import helmet from 'helmet';
import { serve, setup } from 'swagger-ui-express';
import { connectMongodb } from './database/DataBaseController.js';
import { swaggerSpec } from './config/Swagger.js';

// Import Routes
import HealthRoute from './routes/HealthRoute.js';
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
    api.use(json({ limit: '10mb', extended: true }));
    api.use(
      cors({
        origin: ['*'],
        credentials: true,
      }),
    ); //allow cross domain requesting of urls
    api.options('*', cors());
    api.use(morgan('dev'));
    api.set('x-powered-by', false);
    api.use(helmet());

    this.api = api;
    this.httpServer = httpServer;

    return true;
  }

  async mountRoutes() {
    this.api.use('/api/health', HealthRoute);

    // Swagger Setup
    this.api.use('/api/docs', serve, setup(swaggerSpec));
    return true;
  }

  async startServer() {
    await this.configServer();
    await this.mountRoutes();

    // Handling not for API endpoints
    this.api.use((req, res, next) => {
      try {
        throw new Error(NOT_FOUND('route'));
      } catch (error) {
        httpError(next, error, req, 404);
      }
    });

    // Global error handler
    this.api.use(globalErrorhandler);

    // Start server
    this.httpServer.listen(this.options.port, async () => {
      logger.info('APPLICATION_STARTED', {
        meta: {
          PORT: this.options.port,
          SERVER_URL: this.options.server_url,
        },
      });
      logger.info('SWAGGER_STARTED ', {
        meta: { url: `${this.options.server_url}/api/docs` },
      });
      this.options.db_url && (await connectMongodb(this.options.db_url));
    });

    // Handle user interrupts eg: CTRL+C, CTRL+Z
    const shutdown = (signal) => {
      logger.info('RECEIVED SIGNAL', {
        meta: {
          signal: signal,
        },
      });
      this.httpServer.close(() => {
        logger.info('Shutting down server gracefully!');
        process.exit(0);
      });

      // Force close server after 5 seconds
      setTimeout(() => {
        logger.error(
          'Could not close connections in time, forcefully shutting down',
        );
        process.exit(1);
      }, 5000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('SIGTSTP', shutdown);
  }
}

export default Server;
