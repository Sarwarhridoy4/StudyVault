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
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
