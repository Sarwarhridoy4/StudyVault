import { UserRepository } from './user.repository';
import type { IUser } from './user.types';

export const UserService = {
  getAllUsers: async (): Promise<IUser[]> => {
    return UserRepository.findAll();
  },
};
