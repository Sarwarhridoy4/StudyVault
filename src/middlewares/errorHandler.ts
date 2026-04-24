import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
      meta: null,
    });
  }
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    data: null,
    meta: null,
  });
};

export default errorHandler;
