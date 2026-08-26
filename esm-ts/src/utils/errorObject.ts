import { Request } from 'express';
import { THttpError } from '../types/index.js';
import responseMessages from '../constants/responseMessages.js';
import logger from './logger.js';
import { EApplicationEnvironment } from '../constants/application.js';
import config from '../config/index.js';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): THttpError => {
  const errorObj: THttpError = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl
    },
    message: err instanceof Error ? err.message || responseMessages.SOMETHING_WENT_WRONG : responseMessages.SOMETHING_WENT_WRONG,
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null
  };

  // Log
  logger.error(`CONTROLLER_ERROR`, {
    meta: errorObj
  });

  // Production Env check
  if (config.env === EApplicationEnvironment.PRODUCTION) {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return errorObj;
};
