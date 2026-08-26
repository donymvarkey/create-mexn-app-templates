import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/responseHandler.js';
import catchAsync from '../utils/catchAsync.js';

export const healthController = catchAsync((_req: Request, res: Response, 
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  _next: NextFunction): any => {
  const isDbConnected = mongoose.connection.readyState === mongoose.ConnectionStates.connected;
  const healthData = {
    application: 'MEXN App',
    status: isDbConnected ? 'OK' : 'DEGRADED',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  };

  if (!isDbConnected) {
    res.status(503).json({
      status: 'error',
      message: 'Service Unavailable: Database disconnected',
      data: healthData
    });
    return;
  }

  sendSuccess(res, 200, healthData, 'Application is healthy');
});
