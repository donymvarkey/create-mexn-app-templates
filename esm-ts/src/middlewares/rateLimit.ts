import { NextFunction, Request, Response } from 'express';
import config from '../config/index.js';
import { EApplicationEnvironment } from '../constants/application.js';
import responseMessages from '../constants/responseMessages.js';
import httpError from '../utils/httpError.js';
import { rateLimiterMongo } from '../config/rateLimiter.js';

export default (req: Request, _: Response, next: NextFunction) => {
  if (config.env === EApplicationEnvironment.DEVELOPMENT) {
    return next();
  }

  if (rateLimiterMongo) {
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    rateLimiterMongo
      .consume(clientIp, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        httpError(next, new Error(responseMessages.TOO_MANY_REQUESTS), req, 429);
      });
  } else {
    next();
  }
};
