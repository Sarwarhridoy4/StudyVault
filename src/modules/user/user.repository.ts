import User from './user.model';
import type { IUser, UserCreateInput } from './user.types';

export const UserRepository = {
  findAll: async (): Promise<IUser[]> => {
    return User.find().select('-__v -password').lean() as Promise<IUser[]>;
  },

  findByUid: async (uid: string): Promise<IUser | null> => {
    return User.findOne({ uid }).select('-__v -password').lean() as Promise<IUser | null>;
  },

  findByEmail: async (email: string): Promise<IUser | null> => {
    return User.findOne({ email: email.toLowerCase() }).select('-__v -password').lean() as Promise<IUser | null>;
  },

  create: async (data: UserCreateInput): Promise<IUser> => {
    const user = new User(data);
    await user.save();
    // Return safe copy without password
    const obj = user.toObject();
    delete obj.password;
    return obj as IUser;
  },

  updateByUid: async (uid: string, data: Partial<UserCreateInput>): Promise<IUser | null> => {
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: data },
      { new: true, runValidators: true }
    ).select('-__v -password').lean();
    return user as IUser | null;
  },

  deleteByUid: async (uid: string): Promise<IUser | null> => {
    const user = await User.findOneAndDelete({ uid }).select('-__v -password').lean();
    return user as IUser | null;
  },
};
