import { CourseRepository } from './course.repository';
import type { CreateCourseInput, UpdateCourseInput } from './course.validation';
import type { ICourse } from './course.model';

export const CourseService = {
  createCourse: async (data: CreateCourseInput): Promise<ICourse> => {
    return await CourseRepository.create(data);
  },

  getCourseById: async (id: string): Promise<ICourse | null> => {
    return await CourseRepository.findById(id);
  },

  getAllCourses: async (queryStr: Record<string, unknown> = {}): Promise<ICourse[]> => {
    return await CourseRepository.findAll(queryStr);
  },

  updateCourse: async (id: string, data: UpdateCourseInput): Promise<ICourse | null> => {
    return await CourseRepository.updateById(id, data);
  },

  deleteCourse: async (id: string): Promise<ICourse | null> => {
    return await CourseRepository.deleteById(id);
  },

  countCourses: async (filter = {}): Promise<number> => {
    return await CourseRepository.count(filter);
  },

  addModuleToCourse: async (courseId: string, moduleId: string, order: number): Promise<ICourse | null> => {
    return await CourseRepository.addModule(courseId, moduleId, order);
  },

  removeModuleFromCourse: async (courseId: string, moduleId: string): Promise<ICourse | null> => {
    return await CourseRepository.removeModule(courseId, moduleId);
  },

  getCourseModules: async (courseId: string): Promise<ICourse | null> => {
    return await CourseRepository.getModules(courseId);
  },
};
