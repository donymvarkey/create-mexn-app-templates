import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
// @ts-expect-error - No type definitions for xss-clean available
import xss from 'xss-clean';
const xssClean = xss as any;
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { ServerOptions } from './types/index.js';
import HealthRouter from './routes/healthRoute.js';
import logger from './utils/logger.js';
import databaseService from './database/databaseService.js';
import { initRateLimiter } from './config/rateLimiter.js';
import rateLimit from './middlewares/rateLimit.js';
import responseMessages from './constants/responseMessages.js';
import httpError from './utils/httpError.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import { swaggerSpec } from './config/swagger.js';

class Server {
  options: ServerOptions;
  api: Application | null;
  constructor(options: ServerOptions) {
    this.options = options;
    this.api = null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async configServer() {
    const api = express();

    api.use(express.urlencoded({ limit: '10mb', extended: true }));
    api.use(express.json({ limit: '10mb' }));
    api.set('x-powered-by', false);
    api.use(helmet());
    api.use(xssClean());
    api.use(mongoSanitize());
    api.use(hpp());
    api.use(morgan('dev'));
    api.use(
      cors({
        origin: true,
        credentials: true
      })
    );
    api.use(rateLimit);
    this.api = api;
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async mountRoutes() {
    this.api?.use('/api/v1/health', HealthRouter);

    // Swagger UI Setup
    this.api?.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    return true;
  }

  async startServer() {
    await this.configServer();
    await this.mountRoutes();

    this.api?.use((req: Request, _: Response, next: NextFunction) => {
      try {
        throw new Error(responseMessages.NOT_FOUND('route'));
      } catch (error) {
        httpError(next, error, req, 404);
      }
    });

    this.api?.use(globalErrorHandler);

    try {
      if (this.options.database_url) {
        const connection = await databaseService.connect();
        if (connection) {
          logger.info(`DATABASE_CONNECTION`, {
            meta: {
              CONNECTION_NAME: connection.name
            }
          });

          initRateLimiter(connection);
          logger.info(`RATE_LIMITER_INITIATED`);
        }
      }

      const server = this.api?.listen(this.options.port, () => {
        logger.info(`APPLICATION_STARTED`, {
          meta: {
            port: this.options.port,
            SERVER_URL: this.options.server_url
          }
        });
        logger.info(`SWAGGER_STARTED`, {
          meta: { url: `${this.options.server_url || ''}/api/docs` }
        });
      });

      // Graceful shutdown handling
      let isShuttingDown = false;
      const shutdown = (signal: string) => {
        if (isShuttingDown) return;
        isShuttingDown = true;

        logger.info('RECEIVED_SIGNAL', { meta: { signal } });

        const forceTimeout = setTimeout(() => {
          logger.error('Could not close connections in time, forcefully shutting down');
          process.exit(1);
        }, 5000);

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        server?.close(async () => {
          try {
            if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
              await mongoose.connection.close();
              logger.info('Database connection closed.');
            }
            clearTimeout(forceTimeout);
            logger.info('Shutting down server gracefully!');
            process.exit(0);
          } catch (err) {
            logger.error('Error during database teardown', { meta: { error: err } });
            process.exit(1);
          }
        });
      };

      process.on('SIGTERM', () => {
        shutdown('SIGTERM');
      });
      process.on('SIGINT', () => {
        shutdown('SIGINT');
      });
    } catch (error) {
      logger.error('APPLICATION_ERROR:', { meta: error });
      process.exit(1);
    }
  }
}

export default Server;
