import config from '../config/index.js';
import EApplicationEnvironment from '../constants/application.js';
import { TOO_MANY_REQUESTS } from '../constants/responseMessages.js';
import httpError from '../utils/httpError.js';
import { getRateLimiterMongo } from '../config/rateLimiter.js';

const rateLimit = (req, res, next) => {
  if (config.env === EApplicationEnvironment.DEVELOPMENT) {
    return next();
  }

  const limiter = getRateLimiterMongo();
  if (limiter) {
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    limiter
      .consume(clientIp, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        httpError(next, new Error(TOO_MANY_REQUESTS), req, 429);
      });
  } else {
    next();
  }
};

export default rateLimit;
