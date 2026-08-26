/**
 * DataBaseController.js
 * Includes controllers for MongoDB
 * Add controller for other databases from here
 */
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectMongodb = async (uri) => {
  try {
    logger.info('CONNECTING TO DB', { meta: { url: uri } });
    await mongoose.connect(uri);
    logger.info('CONNECTED TO DB', null);
    return mongoose.connection;
  } catch (err) {
    logger.error('CONNECTION FAILED', { meta: { error: err } });
    throw err;
  }
};

export { connectMongodb };
