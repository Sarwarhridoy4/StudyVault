import type { Response } from 'express';

interface ResponseData<T> {
  success: boolean;
  message: string;
  meta?: Record<string, unknown> | null;
  data: T | null;
}

export const sendResponse = <T>(res: Response, statusCode: number, data: ResponseData<T>) => {
  return res.status(statusCode).json(data);
};
