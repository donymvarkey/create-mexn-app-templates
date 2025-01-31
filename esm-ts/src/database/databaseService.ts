import mongoose from 'mongoose';
import config from '../config';
import logger from '../utils/logger';

export default {
  connect: async () => {
    try {
      if (!config.database_url?.length) {
        logger.error('NO_DB_URL_PROVIDED', {
          meta: {
            message: 'No Database URl is provided'
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
    } catch (err) {
      throw err;
    }
  }
};
