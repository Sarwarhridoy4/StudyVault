import mongoose, { Schema } from 'mongoose';
import type { IUser, UserRole, UserCreateInput, UserResponse } from './user.types';

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    displayName: { type: String, trim: true },
    photoURL: { type: String },
    password: { type: String }, // Hashed password for local auth
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },
    emailVerified: { type: Boolean, default: false },
    authProvider: {
      type: String,
      enum: ['firebase', 'local'],
      default: 'local'
    },
  },
  {
    timestamps: true,
  }
);

// Note: Unique indexes on uid and email are already created via schema `unique: true`

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
export type { IUser, UserRole } from './user.types';
export type { UserCreateInput, UserResponse } from './user.types';
