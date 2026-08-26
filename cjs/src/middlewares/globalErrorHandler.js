const { sendError } = require('../utils/responseHandler');
// eslint-disable-next-line no-unused-vars
const globalErrorhandler = (err, req, res, _next) => {
  const statusCode = err && err.statusCode ? err.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    message = message + ' | Trace: ' + err.stack;
  }

  sendError(res, statusCode, message);
};

module.exports = globalErrorhandler;
