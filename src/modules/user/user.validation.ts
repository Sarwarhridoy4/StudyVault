import { z } from 'zod';

/**
 * Schema for user registration via Firebase ID token
 */
export const registerSchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required'),
});

/**
 * Schema for local email/password registration
 */
export const localRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(100).optional(),
});

/**
 * Schema for local email/password login
 */
export const localLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for forgot password request
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * Schema for reset password
 */
export const resetPasswordSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Schema for updating user profile
 * All fields optional
 */
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must be at most 100 characters')
    .optional(),
  photoURL: z.string().url('Photo URL must be a valid URL').optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LocalRegisterInput = z.infer<typeof localRegisterSchema>;
export type LocalLoginInput = z.infer<typeof localLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
