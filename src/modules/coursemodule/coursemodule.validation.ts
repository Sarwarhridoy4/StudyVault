import { z } from 'zod';

export const createCourseModuleSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  moduleId: z.string().min(1, 'Module ID is required'),
  order: z.number().min(0, 'Order must be non-negative').default(0),
});

export const batchLinkSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  modules: z.array(
    z.object({
      moduleId: z.string().min(1, 'Module ID is required'),
      order: z.number().min(0, 'Order must be non-negative'),
    })
  ).min(1, 'At least one module is required'),
});

export type CreateCourseModuleInput = z.infer<typeof createCourseModuleSchema>;
export type BatchLinkInput = z.infer<typeof batchLinkSchema>;
