import appConfig from '../config/index.js';
import EApplicationEnvironment from '../constants/application.js';
import logger from './logger.js';

const httpResponse = (req, res, responseStatusCode, responseMessage, data) => {
  const response = {
    success: [200, 201, 204].includes(responseStatusCode) ? true : false,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message: responseMessage,
    data: data,
  };

  //   Log
  logger.info('CONTROLLER_RESPONSE', {
    meta: response,
  });

  //   Production Env check
  if (appConfig.env === EApplicationEnvironment.PRODUCTION) {
    delete response.request.ip;
  }

  res.status(responseStatusCode).json(response);
};

export default httpResponse;
