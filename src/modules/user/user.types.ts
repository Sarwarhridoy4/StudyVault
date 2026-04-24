import { Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  password?: string; // Hashed password for local auth
  role: UserRole;
  emailVerified: boolean;
  authProvider: 'firebase' | 'local';
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'USER' | 'ADMIN';

// Input type for creating a user (plain object, not a Mongoose Document)
export type UserCreateInput = {
  uid?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  password?: string;
  role?: UserRole;
  emailVerified?: boolean;
  authProvider?: 'firebase' | 'local';
};

// Output type for API responses (excludes sensitive fields)
export type UserResponse = Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'password' | '__v'>;

// Local registration input
export type LocalRegisterInput = {
  email: string;
  password: string;
  displayName?: string;
};

// Local login input
export type LocalLoginInput = {
  email: string;
  password: string;
};

// Local login input
export type LocalLoginInput = {
  email: string;
  password: string;
};
