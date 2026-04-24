import { Router } from 'express';
import { userController } from './user.controller';
import { validate } from '../../middlewares/validation';
import { sanitizeBody } from '../../middlewares/sanitize';
import auth from '../../middlewares/auth';
import {
  registerSchema,
  localRegisterSchema,
  localLoginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './user.validation';

const router = Router();

// ==================== PUBLIC ROUTES ====================

// Firebase/Google authentication (no auth required)
router.post(
  '/firebase',
  validate(registerSchema),
  userController.firebaseAuth
);

// Local email/password registration (no auth required)
router.post(
  '/register',
  sanitizeBody(['email', 'displayName']),
  validate(localRegisterSchema),
  userController.localRegister
);

// Local email/password login (no auth required)
router.post(
  '/login',
  sanitizeBody(['email']),
  validate(localLoginSchema),
  userController.localLogin
);

// Forgot password (no auth required)
router.post(
  '/forgot-password',
  sanitizeBody(['email']),
  validate(forgotPasswordSchema),
  userController.forgotPassword
);

// Reset password (no auth required)
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  userController.resetPassword
);

// ==================== PROTECTED ROUTES ====================

// Logout (requires authentication)
router.post('/logout', auth, userController.logout);

// Get current user profile
router.get('/me', auth, userController.getMe);

// Update current user profile
router.patch(
  '/me',
  auth,
  sanitizeBody(['displayName', 'photoURL']),
  validate(updateProfileSchema),
  userController.updateMe
);

// Delete current user account
router.delete('/me', auth, userController.deleteMe);

export default router;