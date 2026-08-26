import mongoose from 'mongoose';
import config from '../config/index.js';
import logger from '../utils/logger.js';

export default {
  connect: async () => {
    if (!config.database_url?.length) {
      logger.error('NO_DB_URL_PROVIDED', {
        meta: {
          message: 'No Database URL is provided'
        }
      });
      return null;
    }
    logger.info('CONNECTING_TO_DB', {
      meta: {
        db_url: config.database_url
      }
    });
    await mongoose.connect(config.database_url);
    return mongoose.connection;
  }
};
