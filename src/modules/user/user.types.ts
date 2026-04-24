import { Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'USER' | 'ADMIN';

// Type for creating a new user
export type UserCreateInput = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;

// Type for user response (excluding sensitive fields)
export type UserResponse = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;
