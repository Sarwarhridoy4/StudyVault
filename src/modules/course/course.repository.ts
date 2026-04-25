import Course, { type ICourse } from './course.model';
import ApiFeatures from '../../utils/ApiFeatures';
import mongoose from 'mongoose';

export const CourseRepository = {
  create: async (data: Partial<ICourse>): Promise<ICourse> => {
    return await Course.create(data);
  },

  findById: async (id: string): Promise<ICourse | null> => {
    return await Course.findById(id).populate('modules');
  },

  findAll: async (queryStr: Record<string, unknown> = {}): Promise<ICourse[]> => {
    const features = new ApiFeatures(Course.find(), queryStr)
      .search(['title', 'description', 'shortDescription'])
      .filter()
      .sort()
      .paginate();

    return await features.getQuery().populate('modules');
  },

  updateById: async (id: string, data: Partial<ICourse>): Promise<ICourse | null> => {
    return await Course.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).populate('modules');
  },

  deleteById: async (id: string): Promise<ICourse | null> => {
    return await Course.findByIdAndDelete(id);
  },

  count: async (filter = {}): Promise<number> => {
    return await Course.countDocuments(filter);
  },

  addModule: async (courseId: string, moduleId: string): Promise<ICourse | null> => {
    const course = await Course.findById(courseId);
    if (!course) return null;

    // Check if module is already linked (avoid duplicates)
    const isAlreadyLinked = course.modules.some((id: mongoose.Types.ObjectId) => 
      id.toString() === moduleId
    );
    
    if (!isAlreadyLinked) {
      course.modules.push(new mongoose.Types.ObjectId(moduleId));
      await course.save();
    }
    
    return course.populate('modules');
  },

  removeModule: async (courseId: string, moduleId: string): Promise<ICourse | null> => {
    const course = await Course.findById(courseId);
    if (!course) return null;

    course.modules = course.modules.filter((id: mongoose.Types.ObjectId) => 
      id.toString() !== moduleId
    );
    await course.save();
    return course.populate('modules');
  },

  getModules: async (courseId: string): Promise<ICourse | null> => {
    return await Course.findById(courseId).populate('modules');
  },
};
