import mongoose from 'mongoose';
import { sendSuccess } from '../utils/responseHandler.js';
import catchAsync from '../utils/catchAsync.js';

const healthController = catchAsync(async (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const healthData = {
    application: 'MEXN App',
    status: isDbConnected ? 'OK' : 'DEGRADED',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date(),
  };

  if (!isDbConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Service Unavailable: Database disconnected',
      data: healthData,
    });
  }

  sendSuccess(res, 200, healthData, 'Application is healthy');
});

export default healthController;
