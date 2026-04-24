import CourseModule, { type ICourseModule } from './coursemodule.model';
import ApiFeatures from '../../utils/ApiFeatures';

export const CourseModuleRepository = {
  create: async (data: Partial<ICourseModule>): Promise<ICourseModule> => {
    return await CourseModule.create(data);
  },

  findByCourse: async (courseId: string): Promise<ICourseModule[]> => {
    return await CourseModule.find({ courseId })
      .sort({ order: 1 })
      .populate('moduleId');
  },

  findByModule: async (moduleId: string): Promise<ICourseModule[]> => {
    return await CourseModule.find({ moduleId });
  },

  findByCourseAndModule: async (courseId: string, moduleId: string): Promise<ICourseModule | null> => {
    return await CourseModule.findOne({ courseId, moduleId });
  },

  deleteByCourseAndModule: async (courseId: string, moduleId: string): Promise<ICourseModule | null> => {
    return await CourseModule.findOneAndDelete({ courseId, moduleId });
  },

  deleteByCourse: async (courseId: string): Promise<void> => {
    await CourseModule.deleteMany({ courseId });
  },

  deleteByModule: async (moduleId: string): Promise<void> => {
    await CourseModule.deleteMany({ moduleId });
  },

  updateOrder: async (courseId: string, updates: Array<{ moduleId: string; order: number }>): Promise<void> => {
    for (const update of updates) {
      await CourseModule.findOneAndUpdate(
        { courseId, moduleId: update.moduleId },
        { $set: { order: update.order } },
        { new: true }
      );
    }
  },
};
