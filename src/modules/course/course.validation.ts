import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  image: z.string().url('Image must be a valid URL').optional(),
  createdBy: z.string().min(1, 'createdBy is required'),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseInput = z.infer<typeof createCourseSchema> & { imageFile?: Buffer };
export type UpdateCourseInput = z.infer<typeof updateCourseSchema> & { imageFile?: Buffer };
