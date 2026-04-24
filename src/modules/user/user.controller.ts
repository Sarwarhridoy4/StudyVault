import type { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { validate } from '../../middlewares/validation';
import { sanitizeBody } from '../../middlewares/sanitize';
import {
  registerSchema,
  localRegisterSchema,
  localLoginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './user.validation';

export const userController = {
  /**
   * POST /api/v1/auth/firebase
   * Public: Firebase/Google authentication
   * Verifies Firebase ID token and either registers new user or logs in existing user
   */
  firebaseAuth: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = registerSchema.parse(req.body);

    const { user, isNewUser } = await UserService.authenticateWithFirebase(idToken);

    // Establish session for browser-based clients (optional for Firebase)
    // Clients can continue using Bearer token or use session cookie
    (req.session as any).userId = user.uid;

    const message = isNewUser ? 'User registered successfully' : 'Logged in successfully';

    sendResponse(res, 200, {
      success: true,
      message,
      data: user,
      meta: { isNewUser },
    });
  }),

  /**
   * POST /api/v1/auth/register
   * Public: Local email/password registration
   */
  localRegister: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = localRegisterSchema.parse(req.body);
    const sanitizedData = {
      email: validatedData.email.toLowerCase().trim(),
      password: validatedData.password,
      displayName: validatedData.displayName?.trim(),
    };

    const user = await UserService.localRegister(sanitizedData);

    // Establish session
    (req.session as any).userId = user.uid;

    sendResponse(res, 201, {
      success: true,
      message: 'Account created successfully',
      data: user,
      meta: null,
    });
  }),

  /**
   * POST /api/v1/auth/login
   * Public: Local email/password login
   */
  localLogin: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = localLoginSchema.parse(req.body);
    const sanitizedEmail = email.toLowerCase().trim();

    const user = await UserService.localLogin({
      email: sanitizedEmail,
      password,
    });

    // Establish session
    (req.session as any).userId = user.uid;

    sendResponse(res, 200, {
      success: true,
      message: 'Logged in successfully',
      data: user,
      meta: null,
    });
  }),

  /**
   * POST /api/v1/auth/forgot-password
   * Public: Request password reset link via email
   */
  forgotPassword: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const sanitizedEmail = email.toLowerCase().trim();

    const result = await UserService.forgotPassword(sanitizedEmail);

    // In development, token may be included in result for testing
    const meta = result.token ? { token: result.token, note: 'Dev mode only – remove in production' } : null;

    sendResponse(res, 200, {
      success: true,
      message: result.message,
      data: null,
      meta,
    });
  }),

  /**
   * POST /api/v1/auth/reset-password
   * Public: Reset password using token from email
   */
  resetPassword: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, token, newPassword } = resetPasswordSchema.parse(req.body);
    const sanitizedEmail = email.toLowerCase().trim();

    const result = await UserService.resetPassword(sanitizedEmail, token, newPassword);

    sendResponse(res, 200, {
      success: true,
      message: result.message,
      data: null,
      meta: null,
    });
  }),

  /**
   * POST /api/v1/auth/logout
   * Protected: Destroy session
   */
  logout: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      // Clear cookie on client
      res.clearCookie('connect.sid');
      sendResponse(res, 200, {
        success: true,
        message: 'Logged out successfully',
        data: null,
        meta: null,
      });
    });
  }),

  /**
   * GET /api/v1/auth/me
   * Protected: Get current user profile
   * Supports both session and Firebase Bearer token
   */
  getMe: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore - req.user set by auth middleware (session or firebase)
    const uid = req.user.uid;

    const user = await UserService.getProfile(uid);

    sendResponse(res, 200, {
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
      meta: null,
    });
  }),

  /**
   * PATCH /api/v1/auth/me
   * Protected: Update current user profile
   */
  updateMe: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore - req.user set by auth middleware
    const uid = req.user.uid;
    const validatedData = updateProfileSchema.parse(req.body);

    // Sanitization already applied via middleware, but apply again defensively
    const sanitizedData = {
      displayName: validatedData.displayName?.trim(),
      photoURL: validatedData.photoURL?.trim(),
    };

    const updatedUser = await UserService.updateProfile(uid, sanitizedData);

    sendResponse(res, 200, {
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
      meta: null,
    });
  }),

  /**
   * DELETE /api/v1/auth/me
   * Protected: Delete current user account
   */
  deleteMe: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore - req.user set by auth middleware
    const uid = req.user.uid;

    await UserService.deleteAccount(uid);

    // Destroy session on account deletion
    req.session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
      res.clearCookie('connect.sid');
    });

    sendResponse(res, 200, {
      success: true,
      message: 'Account deleted successfully',
      data: null,
      meta: null,
    });
  }),
};
