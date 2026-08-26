import { Response } from 'express';

type StatusType = 'success' | 'fail' | 'error';

const httpResponse = (res: Response, statusCode: number, status: StatusType, dataOrMessage: unknown, message: string | null = null) => {
  const response: Record<string, unknown> = { status };

  if (status === 'success') {
    response.data = dataOrMessage;
    if (message) response.message = message;
  } else if (status === 'fail') {
    response.data = dataOrMessage;
  } else if (status === 'error') {
    response.message = dataOrMessage;
  }

  return res.status(statusCode).json(response);
};

export const sendSuccess = (res: Response, statusCode: number, data: unknown, message: string | null = null) => {
  return httpResponse(res, statusCode, 'success', data, message);
};

export const sendFail = (res: Response, statusCode: number, data: unknown) => {
  return httpResponse(res, statusCode, 'fail', data);
};

export const sendError = (res: Response, statusCode: number, message: string) => {
  return httpResponse(res, statusCode, 'error', message);
};
