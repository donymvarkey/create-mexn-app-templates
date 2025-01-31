import { SOMETHING_WENT_WRONG } from '../constants/responseMessages.js';
import httpResponse from '../utils/httpResponse.js';

// eslint-disable-next-line no-unused-vars
const globalErrorhandler = (err, req, res, _next) => {
  //   res.status(err.statusCode).json(err);
  httpResponse(req, res, err.statusCode, SOMETHING_WENT_WRONG, err);
};

export default globalErrorhandler;
