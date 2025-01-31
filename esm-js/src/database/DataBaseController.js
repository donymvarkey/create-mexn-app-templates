/**
 * DataBaseController.js
 * Includes controllers for MongoDB
 * Add controller for other databases from here
 */
import { connect } from 'mongoose';
import logger from '../utils/logger.js';

const connectMongodb = async (uri) => {
  logger.info('CONNECTING TO DB', { meta: { url: uri } });
  await connect(uri)
    .then(() => {
      logger.info('CONNECTED TO DB', null);
      return true;
    })
    .catch((err) => {
      logger.error('CONNECTION FAILED', { meta: { error: err } });
      return false;
    });
};

export { connectMongodb };
