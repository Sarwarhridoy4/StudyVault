import { UserRepository } from './user.repository';
import User from './user.model';
import AppError from '../../utils/AppError';
import type { IUser, UserCreateInput, LocalRegisterInput, LocalLoginInput } from './user.types';
import { verifyIdToken } from '../../services/firebase.service';
import bcrypt from 'bcrypt';

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
      const { uid, email } = decodedToken;
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
        displayName,
        photoURL,
        role,
        emailVerified: true,
        authProvider: 'firebase',
      };

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
