import errorObject from './errorObject.js';

const httpError = (nextFunc, err, req, errorStatusCode = 500) => {
  const errorObj = errorObject(err, req, errorStatusCode);
  return nextFunc(errorObj);
};

export default httpError;
