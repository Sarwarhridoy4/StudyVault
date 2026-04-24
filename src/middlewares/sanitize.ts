/**
 * Simple XSS sanitization using regex
 * Strips HTML tags and dangerous patterns
 */

/**
 * Sanitizes string fields to prevent XSS attacks
 * Removes HTML tags, script blocks, and dangerous attributes
 */
export const sanitizeString = (input: string): string => {
  if (!input) return input;

  // Remove all HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Remove common XSS patterns
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');

  return sanitized;
};

/**
 * Sanitizes an object's string fields recursively
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === 'string' ? sanitizeString(item as string) : item
        );
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized as T;
};

/**
 * Middleware to sanitize request body
 * Apply to routes that accept user-generated text content
 */
export const sanitizeBody = (fields?: string[]) => {
  return (req: { body: Record<string, unknown> }, _res: any, next: any) => {
    if (req.body && typeof req.body === 'object') {
      if (fields && fields.length > 0) {
        // Only sanitize specific fields
        fields.forEach((field) => {
          if (typeof req.body[field] === 'string') {
            req.body[field] = sanitizeString(req.body[field]);
          }
        });
      } else {
        // Sanitize all string fields in body
        req.body = sanitizeObject(req.body);
      }
    }
    next();
  };
};
