import { CourseModuleRepository } from './coursemodule.repository';
import type { CreateCourseModuleInput, BatchLinkInput } from './coursemodule.validation';
import type { ICourseModule } from './coursemodule.model';
import { CourseService } from '../course/course.service';
import AppError from '../../utils/AppError';

export const CourseModuleService = {
  linkModuleToCourse: async (data: CreateCourseModuleInput): Promise<ICourseModule> => {
    const { courseId, moduleId, order } = data;

    // Check if already linked
    const existing = await CourseModuleRepository.findByCourseAndModule(courseId, moduleId);
    if (existing) {
      throw new AppError('Module is already linked to this course', 409);
    }

    return await CourseModuleRepository.create(data as any);
  },

  unlinkModuleFromCourse: async (courseId: string, moduleId: string): Promise<void> => {
    const deleted = await CourseModuleRepository.deleteByCourseAndModule(courseId, moduleId);
    if (!deleted) {
      throw new AppError('Link not found between course and module', 404);
    }
  },

  getModulesByCourse: async (courseId: string): Promise<any[]> => {
    const links = await CourseModuleRepository.findByCourse(courseId);
    return links.map(link => ({
      module: link.moduleId,
      order: link.order,
    }));
  },

  getCoursesByModule: async (moduleId: string): Promise<any[]> => {
    const links = await CourseModuleRepository.findByModule(moduleId);
    return links.map(link => ({
      course: link.courseId,
      order: link.order,
    }));
  },

  batchLinkModules: async (data: BatchLinkInput): Promise<void> => {
    const { courseId, modules } = data;

    // Verify course exists
    const course = await CourseService.getCourseById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Create all links
    for (const item of modules) {
      const existing = await CourseModuleRepository.findByCourseAndModule(courseId, item.moduleId);
      if (existing) {
        // Update order if already exists
        await CourseModuleRepository.updateOrder(courseId, [{ moduleId: item.moduleId, order: item.order }]);
      } else {
        await CourseModuleRepository.create({
          courseId,
          moduleId: item.moduleId,
          order: item.order,
        } as any);
      }
    }
  },

  batchUnlinkModules: async (courseId: string, moduleIds: string[]): Promise<void> => {
    for (const moduleId of moduleIds) {
      await CourseModuleRepository.deleteByCourseAndModule(courseId, moduleId);
    }
  },
};
