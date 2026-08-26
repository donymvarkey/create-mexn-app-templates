'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createServer } = require('node:http');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const { connectMongodb } = require('./database/databaseService');
const { swaggerSpec } = require('./config/swagger');
const { initRateLimiter } = require('./config/rateLimiter');

// Import Routes & Middlewares
const healthRoute = require('./routes/healthRoute');
const rateLimit = require('./middlewares/rateLimit');
const logger = require('./utils/logger');
const responseMessages = require('./constants/responseMessages');
const httpError = require('./utils/httpError');
const globalErrorhandler = require('./middlewares/globalErrorHandler');

class Server {
  constructor(options) {
    this.options = options;
    this.api = null;
    this.httpServer = null;
  }

  async configServer() {
    const api = express();
    const httpServer = createServer(api);

    api.use(express.urlencoded({ limit: '10mb', extended: true }));
    api.use(express.json({ limit: '10mb' }));
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
    this.api.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    return true;
  }

  async startServer() {
    await this.configServer();
    await this.mountRoutes();

    // Handling 404 for unknown API endpoints
    this.api.use((req, res, next) => {
      try {
        throw new Error(responseMessages.NOT_FOUND('route'));
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

module.exports = Server;
