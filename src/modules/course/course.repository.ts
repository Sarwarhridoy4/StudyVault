import Course, { type ICourse } from './course.model';
import ApiFeatures from '../../utils/ApiFeatures';

export const CourseRepository = {
  create: async (data: Partial<ICourse>): Promise<ICourse> => {
    return await Course.create(data);
  },

  findById: async (id: string): Promise<ICourse | null> => {
    return await Course.findById(id).populate('modules.module');
  },

  findAll: async (queryStr: Record<string, unknown> = {}): Promise<ICourse[]> => {
    const features = new ApiFeatures(Course.find(), queryStr)
      .search(['title', 'description', 'shortDescription'])
      .filter()
      .sort()
      .paginate();

    return await features.getQuery().populate('modules.module');
  },

  updateById: async (id: string, data: Partial<ICourse>): Promise<ICourse | null> => {
    return await Course.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).populate('modules.module');
  },

  deleteById: async (id: string): Promise<ICourse | null> => {
    return await Course.findByIdAndDelete(id);
  },

  count: async (filter = {}): Promise<number> => {
    return await Course.countDocuments(filter);
  },

  addModule: async (courseId: string, moduleId: string, order: number): Promise<ICourse | null> => {
    const course = await Course.findById(courseId);
    if (!course) return null;

    // Remove if module already exists to avoid duplicates
    course.modules = course.modules.filter(m => m.module.toString() !== moduleId);
    course.modules.push({ module: moduleId as any, order });
    course.modules.sort((a, b) => a.order - b.order);

    await course.save();
    return course.populate('modules.module');
  },

  removeModule: async (courseId: string, moduleId: string): Promise<ICourse | null> => {
    const course = await Course.findById(courseId);
    if (!course) return null;

    course.modules = course.modules.filter(m => m.module.toString() !== moduleId);
    await course.save();
    return course.populate('modules.module');
  },

  getModules: async (courseId: string): Promise<ICourse | null> => {
    return await Course.findById(courseId).populate('modules.module');
  },
};
