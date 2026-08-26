import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { sendFail } from '../utils/responseHandler.js';

const validateRequest = (schema: any) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const formattedErrors = (err as any).errors.reduce((acc: Record<string, string>, error: ZodIssue) => {
        const path = error.path.join('.');
        acc[path] = error.message;
        return acc;
      }, {});
      sendFail(res, 400, formattedErrors);
      return;
    }
    sendFail(res, 400, { error: 'Validation failed' });
    return;
  }
};

export default validateRequest;
