import mongoose, { Schema } from 'mongoose';
import type { IUser, UserRole, UserCreateInput, UserResponse } from './user.types';

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    displayName: { type: String, trim: true },
    photoURL: { type: String },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ uid: 1 });
UserSchema.index({ role: 1 });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
export type { IUser, UserRole } from './user.types';
export type { UserCreateInput, UserResponse } from './user.types';
