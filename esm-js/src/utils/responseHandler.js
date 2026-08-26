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

export const sendSuccess = (res, statusCode, data, message = null) => {
  return httpResponse(res, statusCode, 'success', data, message);
};

export const sendFail = (res, statusCode, data) => {
  return httpResponse(res, statusCode, 'fail', data);
};

export const sendError = (res, statusCode, message) => {
  return httpResponse(res, statusCode, 'error', message);
};
