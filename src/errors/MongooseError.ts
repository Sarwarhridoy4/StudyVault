import AppError from '../utils/AppError';

/**
 * Custom error for MongoDB/Mongoose errors
 */
export default class MongooseError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    this.status = 'fail';
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Create Mongoose error from duplicate key error
 */
export const getDuplicateKeyError = (err: any): AppError => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return new AppError(`Duplicate field value: ${field}. Please use a different value.`, 409);
  }
  return new MongooseError('Database operation failed');
};

/**
 * Create Mongoose error from cast error
 */
export const getCastError = (err: any): AppError => {
  if (err.name === 'CastError') {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }
  return new MongooseError('Database operation failed');
};

/**
 * Handle all Mongoose errors
 */
export const handleMongooseError = (err: any): AppError => {
  if (err.code === 11000) {
    return getDuplicateKeyError(err);
  }
  if (err.name === 'CastError') {
    return getCastError(err);
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return new AppError(messages[0] || 'Validation failed', 400);
  }
  return new MongooseError('Database error occurred');
};
