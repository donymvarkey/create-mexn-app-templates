const httpResponse = (
  res,
  statusCode,
  status,
  dataOrMessage,
  message = null,
) => {
  const response = {
    status,
    ...(status === 'success' && { data: dataOrMessage }),
    ...(status === 'fail' && { data: dataOrMessage }),
    ...(status === 'error' && { message: dataOrMessage }),
    ...(message && status === 'success' && { message }),
  };
  return res.status(statusCode).json(response);
};

const sendSuccess = (res, statusCode, data, message = null) => {
  return httpResponse(res, statusCode, 'success', data, message);
};

const sendFail = (res, statusCode, data) => {
  return httpResponse(res, statusCode, 'fail', data);
};

const sendError = (res, statusCode, message) => {
  return httpResponse(res, statusCode, 'error', message);
};

module.exports = {
  sendSuccess,
  sendFail,
  sendError,
};
