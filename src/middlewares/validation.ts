import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { isZodError } from '../utils/errorFormatter';

/**
 * Middleware factory that validates request body against a Zod schema
 * Automatically passes Zod errors to error handler
 */
export const validate = <T extends ZodSchema<any>>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      // Pass Zod errors directly to errorHandler
      // errorHandler will format them nicely
      next(err);
    }
  };
};

/**
 * Validate query parameters against a Zod schema
 */
export const validateQuery = <T extends ZodSchema<any>>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Validate route params against a Zod schema
 */
export const validateParams = <T extends ZodSchema<any>>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (err) {
      next(err);
    }
  };
};
