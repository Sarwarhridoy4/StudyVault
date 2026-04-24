import User from './user.model';
import type { IUser } from './user.types';

export const UserRepository = {
  findAll: async (): Promise<IUser[]> => {
    return User.find().select('-__v').lean();
  },
};
