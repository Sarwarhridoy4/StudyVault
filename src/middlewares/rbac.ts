import type { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../errors/AuthError';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'USER' | 'ADMIN';
    emailVerified: boolean;
  };
}

/**
 * Role-Based Access Control middleware
 * @param allowedRoles - List of roles permitted to access the route
 * Usage: rbac('ADMIN') or rbac('USER', 'ADMIN')
 */
const rbac = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Ensure auth middleware ran first
    if (!req.user) {
      return next(new AuthorizationError('Authentication required'));
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return next(new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
};

export default rbac;
