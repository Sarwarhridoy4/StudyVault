import Study, { type IStudy } from './study.model';
import ApiFeatures from '../../utils/ApiFeatures';

export const StudyRepository = {
  create: async (data: Partial<IStudy>): Promise<IStudy> => {
    return await Study.create(data);
  },

  findById: async (id: string): Promise<IStudy | null> => {
    return await Study.findById(id);
  },

  findAll: async (queryStr: Record<string, unknown> = {}): Promise<IStudy[]> => {
    const features = new ApiFeatures(Study.find(), queryStr)
      .search(['title', 'description', 'shortDescription'])
      .filter()
      .sort()
      .paginate();
    
    return await features.getQuery();
  },

  updateById: async (id: string, data: Partial<IStudy>): Promise<IStudy | null> => {
    return await Study.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  },

  deleteById: async (id: string): Promise<IStudy | null> => {
    return await Study.findByIdAndDelete(id);
  },

  count: async (filter = {}): Promise<number> => {
    return await Study.countDocuments(filter);
  },
};
