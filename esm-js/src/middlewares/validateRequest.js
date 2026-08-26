import { sendFail } from '../utils/responseHandler.js';

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.reduce((acc, error) => {
        const path = error.path.join('.');
        acc[path] = error.message;
        return acc;
      }, {});
      return sendFail(res, 400, formattedErrors);
    }
    return sendFail(res, 400, { error: 'Validation failed' });
  }
};

export default validateRequest;
