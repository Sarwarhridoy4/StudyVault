import { moduleRepository } from './module.repository';
import AppError from '../../utils/AppError';
import type { ModuleCreateInput, ModuleUpdateInput } from './module.validation';
import type { IModule } from './module.model';

export const moduleService = {
  getAllModules: async (queryStr: Record<string, unknown> = {}): Promise<IModule[]> => {
    return moduleRepository.findAll(queryStr);
  },

  getModuleById: async (id: string): Promise<IModule | null> => {
    const module = await moduleRepository.findById(id);
    if (!module) {
      throw new AppError('Module not found', 404);
    }
    return module;
  },

  createModule: async (data: ModuleCreateInput): Promise<IModule> => {
    return moduleRepository.create(data);
  },

  updateModule: async (id: string, data: ModuleUpdateInput): Promise<IModule | null> => {
    const existing = await moduleRepository.findById(id);
    if (!existing) {
      throw new AppError('Module not found', 404);
    }
    return moduleRepository.updateById(id, data);
  },

  deleteModule: async (id: string): Promise<IModule | null> => {
    const existing = await moduleRepository.findById(id);
    if (!existing) {
      throw new AppError('Module not found', 404);
    }
    return moduleRepository.deleteById(id);
  },

  getUserModules: async (userId: string): Promise<IModule[]> => {
    return moduleRepository.findAll({ createdBy: userId });
  },
};
