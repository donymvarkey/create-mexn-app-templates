const config = require('../config');
const EApplicationEnvironment = require('../constants/application');
const responseMessages = require('../constants/responseMessages');
const httpError = require('../utils/httpError');
const { rateLimiterMongo } = require('../config/rateLimiter');

const rateLimit = (req, res, next) => {
  if (config.env === EApplicationEnvironment.DEVELOPMENT) {
    return next();
  }

  const limiter = rateLimiterMongo();
  if (limiter) {
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    limiter
      .consume(clientIp, 1)
      .then(() => {
        next();
      })
      .catch(() => {
        httpError(
          next,
          new Error(responseMessages.TOO_MANY_REQUESTS),
          req,
          429,
        );
      });
  } else {
    next();
  }
};

module.exports = rateLimit;
