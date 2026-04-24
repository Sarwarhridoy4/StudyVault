import mongoose, { Schema } from 'mongoose';
import type { IUser, UserRole, UserCreateInput, UserResponse } from './user.types';

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true, default: () => `local_${new mongoose.Types.ObjectId()}` },
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
    // Password reset fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Additional indexes for performance (unique indexes already created via schema)
UserSchema.index({ role: 1 });
UserSchema.index({ resetPasswordToken: 1 }, { unique: true, sparse: true });
UserSchema.index({ resetPasswordExpires: 1 }, { expireAfterSeconds: 0 }); // TTL index

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
export type { IUser, UserRole } from './user.types';
export type { UserCreateInput, UserResponse } from './user.types';
