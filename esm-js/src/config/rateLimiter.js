import { RateLimiterMongo } from 'rate-limiter-flexible';

let rateLimiterMongo = null;

const DURATION = 60;
const POINTS = 10;

export const initRateLimiter = (mongooseConnection) => {
  rateLimiterMongo = new RateLimiterMongo({
    storeClient: mongooseConnection,
    points: POINTS,
    duration: DURATION,
  });
};

export const getRateLimiterMongo = () => rateLimiterMongo;

export default {
  initRateLimiter,
  getRateLimiterMongo,
};
