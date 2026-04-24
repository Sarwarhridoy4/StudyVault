import { z } from 'zod';

export const itemValidationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(500),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  image: z.string().url('Image must be a valid URL'),
});

export const itemCreateFullSchema = itemValidationSchema.extend({
  createdBy: z.string().min(1, 'createdBy is required'),
});

export const itemUpdateValidationSchema = itemValidationSchema.partial();

export type ItemCreateFormInput = z.infer<typeof itemValidationSchema>;
export type ItemCreateInput = z.infer<typeof itemCreateFullSchema>;
export type ItemUpdateInput = z.infer<typeof itemUpdateValidationSchema>;
