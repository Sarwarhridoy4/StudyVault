import Module, { type IModule } from './module.model';
import ApiFeatures from '../../utils/ApiFeatures';

export const moduleRepository = {
  create: async (data: Partial<IModule>): Promise<IModule> => {
    return await Module.create(data);
  },

  findById: async (id: string): Promise<IModule | null> => {
    return await Module.findById(id);
  },

  findAll: async (queryStr: Record<string, unknown> = {}): Promise<IModule[]> => {
    const features = new ApiFeatures(Module.find(), queryStr)
      .search(['title', 'shortDescription', 'description'])
      .filter()
      .sort()
      .paginate();

    return await features.getQuery();
  },

  updateById: async (id: string, data: Partial<IModule>): Promise<IModule | null> => {
    return await Module.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  },

  deleteById: async (id: string): Promise<IModule | null> => {
    return await Module.findByIdAndDelete(id);
  },

  count: async (filter = {}): Promise<number> => {
    return await Module.countDocuments(filter);
  },
};
