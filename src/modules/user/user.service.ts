import { UserRepository } from './user.repository';
import User from './user.model';
import AppError from '../../utils/AppError';
import env from '../../config/env';
import type { IUser, UserCreateInput, LocalRegisterInput, LocalLoginInput } from './user.types';
import { verifyIdToken } from '../../services/firebase.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../services/email.service';

export const UserService = {
  getAllUsers: async (): Promise<IUser[]> => {
    return UserRepository.findAll();
  },

  /**
   * Firebase authentication: Register new user OR login existing user
   * Idempotent - same UID can call multiple times safely
   */
  authenticateWithFirebase: async (idToken: string): Promise<{ user: IUser; isNewUser: boolean }> => {
    try {
      const decodedToken = await verifyIdToken(idToken);
      const { uid, email: rawEmail } = decodedToken;
      if (!rawEmail) throw new AppError('Email is required from Firebase token', 400);
      const email = rawEmail;

      const displayName = decodedToken.name ?? undefined;
      const photoURL = decodedToken.picture ?? undefined;

      const existingUser = await UserRepository.findByUid(uid);
      if (existingUser) {
        return { user: existingUser, isNewUser: false };
      }

      const emailExists = await UserRepository.findByEmail(email);
      if (emailExists) {
        throw new AppError('Email already registered with different account', 409);
      }

      let role: 'USER' | 'ADMIN' = 'USER';
      if (uid.startsWith('admin_')) {
        role = 'ADMIN';
      }

      const userData: UserCreateInput = {
        uid,
        email,
        role,
        emailVerified: true,
        authProvider: 'firebase',
      };
      if (displayName !== undefined) userData.displayName = displayName;
      if (photoURL !== undefined) userData.photoURL = photoURL;

      const newUser = await UserRepository.create(userData);
      return { user: newUser, isNewUser: true };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Authentication failed', 500);
    }
  },

  /**
   * Local registration with email/password
   */
  localRegister: async (data: LocalRegisterInput): Promise<IUser> => {
    const { email, password, displayName } = data;

    const existingEmail = await UserRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError('Email already registered', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uid = `local_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

    const userData: UserCreateInput = {
      uid,
      email,
      displayName,
      password: hashedPassword,
      role: 'USER',
      emailVerified: false,
      authProvider: 'local',
    };

    const newUser = await UserRepository.create(userData);
    return newUser;
  },

  /**
   * Local login with email/password
   */
  localLogin: async (data: LocalLoginInput): Promise<IUser> => {
    const { email, password } = data;
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    if (user.authProvider === 'firebase') {
      throw new AppError('Please use Google login for this account', 401);
    }

    // Fetch full user record including password hash
    const fullUser = await User.findOne({ email: email.toLowerCase() }).select('+password').lean() as any;
    if (!fullUser) {
      throw new AppError('Invalid credentials', 401);
    }
    if (fullUser.authProvider === 'firebase') {
      throw new AppError('Please use Google login for this account', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, fullUser.password || '');
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Return safe user (without password) using repository safe method
    const safeUser = await UserRepository.findByUid(fullUser.uid);
    if (!safeUser) {
      throw new AppError('User not found', 404);
    }
    return safeUser;
  },

  /**
   * Forgot Password: Generate reset token and send email
   * flow: find user -> generate token -> save token+expiry -> send email
   */
  forgotPassword: async (email: string): Promise<{ message: string; token?: string }> => {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return { message: 'If an account exists with that email, you will receive a password reset link.' };
    }

    // Only local auth users can reset via email
    if (user.authProvider === 'firebase') {
      return { message: 'If an account exists with that email, you will receive a password reset link.' };
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token and expiry to user
    await User.findOneAndUpdate(
      { uid: user.uid },
      { $set: { resetPasswordToken: resetToken, resetPasswordExpires: resetExpires } }
    );

    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.displayName);
    } catch (emailErr) {
      console.error('Failed to send reset email:', emailErr);
      throw new AppError('Failed to send reset email. Please try again later.', 500);
    }

    // In development, return token in response for testing
    const devToken = env.NODE_ENV === 'development' ? resetToken : undefined;

    return {
      message: 'If an account exists with that email, you will receive a password reset link.',
      token: devToken,
    };
  },

  /**
   * Reset Password: Verify token and update password
   * flow: find by email+token -> check expiry -> hash new password -> clear token fields -> save
   */
  resetPassword: async (email: string, token: string, newPassword: string): Promise<{ message: string }> => {
    // Find user by email including password and reset fields
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password +resetPasswordToken +resetPasswordExpires')
      .lean() as any; // Cast to any for simplicity – fields are set by forgotPassword

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Check auth provider
    if (user.authProvider === 'firebase') {
      throw new AppError('Cannot reset password for Firebase-authenticated users', 400);
    }

    // Verify token match
    if (user.resetPasswordToken !== token) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Check expiry
    if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      // Clear expired token
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { resetPasswordToken: undefined, resetPasswordExpires: undefined } }
      );
      throw new AppError('Reset token has expired. Please request a new password reset.', 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token fields
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
        },
      }
    );

    return { message: 'Password has been reset successfully. You can now log in with your new password.' };
  },

  /**
   * Get user profile by UID
   */
  getProfile: async (uid: string): Promise<IUser> => {
    const user = await UserRepository.findByUid(uid);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  /**
   * Update user profile
   */
  updateProfile: async (uid: string, data: Partial<Pick<UserCreateInput, 'displayName' | 'photoURL'>>): Promise<IUser> => {
    const user = await UserRepository.updateByUid(uid, data);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  /**
   * Delete user account
   */
  deleteAccount: async (uid: string): Promise<boolean> => {
    const user = await UserRepository.deleteByUid(uid);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return true;
  },
};
