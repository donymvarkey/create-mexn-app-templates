const { RateLimiterMongo } = require('rate-limiter-flexible');

let rateLimiterMongo = null;

const DURATION = 60;
const POINTS = 10;

const initRateLimiter = (mongooseConnection) => {
  rateLimiterMongo = new RateLimiterMongo({
    storeClient: mongooseConnection,
    points: POINTS,
    duration: DURATION,
  });
};

module.exports = {
  rateLimiterMongo: () => rateLimiterMongo,
  initRateLimiter,
};
