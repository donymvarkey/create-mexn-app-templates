import appConfig from '../config/index.js';
import EApplicationEnvironment from '../constants/application.js';
import { SOMETHING_WENT_WRONG } from '../constants/responseMessages.js';
import logger from './logger.js';

const errorObject = (err, req, errorStatusCode = 500) => {
  const errorObj = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message:
      err instanceof Error
        ? err.message || SOMETHING_WENT_WRONG
        : SOMETHING_WENT_WRONG,
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null,
  };

  // Log
  logger.error('CONTROLLER_ERROR', {
    meta: errorObj,
  });

  // Production Env check
  if (appConfig.env === EApplicationEnvironment.PRODUCTION) {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return errorObj;
};

export default errorObject;
