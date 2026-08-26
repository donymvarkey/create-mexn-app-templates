import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHandler.js';
import { THttpError } from '../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: THttpError | Error, _: Request, res: Response, __: NextFunction) => {
  const statusCode = (err as THttpError).statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production' && (err as Error).stack) {
    message = message + ' | Trace: ' + (err as Error).stack;
  }

  sendError(res, statusCode, message);
};
