import { CourseRepository } from './course.repository';
import type { CreateCourseInput, UpdateCourseInput } from './course.validation';
import type { ICourse } from './course.model';
import { createWithImageTransaction, updateWithImageTransaction, deleteWithImageCleanup } from '../../services/image.service';

export const CourseService = {
  createCourse: async (data: CreateCourseInput): Promise<ICourse> => {
    // If imageFile is provided, use transaction helper to upload image and create course
    if (data.imageFile) {
      const result = await createWithImageTransaction(
        data.imageFile,
        async (imageUrl: string, imagePublicId: string) => {
          return await CourseRepository.create({
            ...data,
            image: imageUrl,
            imagePublicId,
          });
        },
        'studyvault/courses'
      );
      return result.data;
    }
    // If no imageFile, assume image is already provided as URL (e.g., external URL)
    return await CourseRepository.create(data);
  },

  getCourseById: async (id: string): Promise<ICourse | null> => {
    return await CourseRepository.findById(id);
  },

  getAllCourses: async (queryStr: Record<string, unknown> = {}): Promise<ICourse[]> => {
    return await CourseRepository.findAll(queryStr);
  },

  updateCourse: async (id: string, data: UpdateCourseInput): Promise<ICourse | null> => {
    // If imageFile is provided, use transaction helper to upload new image and update course
    if (data.imageFile) {
      // First get the existing course to retrieve old image publicId
      const existingCourse = await CourseRepository.findById(id);
      if (!existingCourse) return null;

      const result = await updateWithImageTransaction(
        {
          newImageFile: data.imageFile,
          oldImagePublicId: existingCourse.imagePublicId || undefined,
        },
        async (imageUrl?: string, imagePublicId?: string) => {
          const updateData: Partial<ICourse> = { ...data };
          if (imageUrl && imagePublicId) {
            updateData.image = imageUrl;
            updateData.imagePublicId = imagePublicId;
          }
          return await CourseRepository.updateById(id, updateData);
        },
        'studyvault/courses'
      );
      return result.data;
    }
    // If no imageFile, just update the course normally
    return await CourseRepository.updateById(id, data);
  },

  deleteCourse: async (id: string): Promise<ICourse | null> => {
    // Get the course first to retrieve image publicId for cleanup
    const course = await CourseRepository.findById(id);
    if (!course) return null;

    const result = await deleteWithImageCleanup(
      course.imagePublicId || undefined,
      async () => {
        return await CourseRepository.deleteById(id);
      }
    );
    return result.data;
  },

  countCourses: async (filter = {}): Promise<number> => {
    return await CourseRepository.count(filter);
  },

  addModuleToCourse: async (courseId: string, moduleId: string): Promise<ICourse | null> => {
    return await CourseRepository.addModule(courseId, moduleId);
  },

  removeModuleFromCourse: async (courseId: string, moduleId: string): Promise<ICourse | null> => {
    return await CourseRepository.removeModule(courseId, moduleId);
  },

  getCourseModules: async (courseId: string): Promise<ICourse | null> => {
    return await CourseRepository.getModules(courseId);
  },
};
