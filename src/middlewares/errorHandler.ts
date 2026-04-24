import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { isZodError, formatValidationErrors } from '../utils/errorFormatter';
import { handleMongooseError } from '../errors/MongooseError';

const errorHandler = (
  err: Error | AppError | any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error for debugging (consider using Winston in production)
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  // 1. Handle AppError (custom operational errors)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
      meta: null,
    });
    return;
  }

  // 2. Handle Zod validation errors
  if (isZodError(err)) {
    const errors = formatValidationErrors(err);
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      data: null,
      meta: null,
    });
    return;
  }

  // 3. Handle Mongoose errors (duplicate key, cast, validation)
  if (err.name === 'MongoServerError' || err.name === 'MongooseError') {
    const appError = handleMongooseError(err);
    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      data: null,
      meta: null,
    });
    return;
  }

  // 4. Handle Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({
      success: false,
      message: 'File size too large. Maximum 5MB allowed.',
      data: null,
      meta: null,
    });
    return;
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    res.status(400).json({
      success: false,
      message: 'Too many files. Only 1 image allowed.',
      data: null,
      meta: null,
    });
    return;
  }

  // 5. Handle file type errors
  if (err.message?.includes('Invalid file type')) {
    res.status(400).json({
      success: false,
      message: err.message,
      data: null,
      meta: null,
    });
    return;
  }

  // 6. Handle CastError (invalid ID, etc.)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      data: null,
      meta: null,
    });
    return;
  }

  // 7. Handle duplicate key (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)?.[0] || 'field';
    res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a different value.`,
      data: null,
      meta: null,
    });
    return;
  }

  // 8. Handle JSON parse errors
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
      data: null,
      meta: null,
    });
    return;
  }

  // 9. Fallback - Internal Server Error (hide details in prod)
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    data: null,
    meta: null,
  });
};

export default errorHandler;
