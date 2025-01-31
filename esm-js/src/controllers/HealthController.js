import { SUCCESS } from '../constants/responseMessages.js';
import getServerHealthDetails from '../services/HealthService.js';
import httpError from '../utils/httpError.js';
import httpResponse from '../utils/httpResponse.js';
import logger from '../utils/logger.js';

const healthController = async (req, res, next) => {
  try {
    const healthData = getServerHealthDetails();
    httpResponse(req, res, 200, SUCCESS, healthData);
  } catch (error) {
    logger.error('INTERNAL SERVER ERROR', { meta: { error: error } });
    httpError(next, error, req, 500);
  }
};

export { healthController };
