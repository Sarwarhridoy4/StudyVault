import type { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../modules/user/user.repository';
import { verifyIdToken } from '../services/firebase.service';
import AuthError from '../errors/AuthError';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'USER' | 'ADMIN';
    emailVerified: boolean;
    authProvider: 'firebase' | 'local';
  };
}

/**
 * Authentication middleware
 * Supports two auth methods:
 * 1. Session-based: req.session.userId (set after login/register)
 * 2. Firebase Bearer token: Authorization: Bearer <idToken>
 *
 * Priority: Session first, then Firebase token
 */
const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Method 1: Session-based authentication (local email/password)
    if (req.session && (req.session as any).userId) {
      const userId = (req.session as any).userId;
      const user = await UserRepository.findByUid(userId);
      if (user) {
        req.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: user.role,
          emailVerified: user.emailVerified,
          authProvider: 'local',
        };
        // Renew session on activity (optional sliding expiration)
        req.session.touch?.();
        return next();
      }
      // Invalid session: clear it and fall through to next method
      req.session.destroy(() => {});
    }

    // Method 2: Firebase Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const parts = authHeader.split(' ');
      if (parts.length !== 2) {
        throw new AuthError('Invalid authorization header format');
      }
      const token = parts[1];
      const decodedToken = await verifyIdToken(token);
      const uid = decodedToken.uid;

      const user = await UserRepository.findByUid(uid);
      if (!user) {
        throw new AuthError('User not registered in system. Please complete registration.');
      }

      req.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        emailVerified: user.emailVerified,
        authProvider: 'firebase',
      };

      // Optionally establish session for Firebase users (for browser clients)
      if (req.session) {
        (req.session as any).userId = user.uid;
      }

      return next();
    }

    // No valid authentication method found
    throw new AuthError('No valid authentication provided');
  } catch (error) {
    next(error);
  }
};

export default auth;
