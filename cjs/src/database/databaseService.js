/**
 * DataBaseController.js
 * Includes controllers for MongoDB
 * Add controller for other databases from here
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

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

module.exports = { connectMongodb };
