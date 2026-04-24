import { ZodError, type ZodIssue } from 'zod';

/**
 * Simplifies Zod validation errors into user-friendly messages
 * Returns array of error messages (e.g., ["title must be at least 3 characters"])
 */
export const formatValidationErrors = (error: ZodError): string[] => {
  const errors: string[] = [];

  if (error.issues) {
    for (const issue of error.issues) {
      // Extract just the error message, skip the path
      errors.push(issue.message);
    }
  }

  return errors;
};

/**
 * Format a single validation error for a specific field
 * Returns message or null if no error for that field
 */
export const formatFieldError = (issues: ZodIssue[] | undefined, field: string): string | null => {
  if (!issues) return null;
  const fieldIssues = issues.filter((issue) => issue.path?.[0] === field);
  return fieldIssues.length > 0 ? fieldIssues[0]?.message || null : null;
};

/**
 * Get first validation error message (quick helper)
 */
export const getFirstValidationError = (error: ZodError): string => {
  return error.issues?.[0]?.message || 'Validation failed';
};

/**
 * Check if error is Zod validation error
 */
export const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};
