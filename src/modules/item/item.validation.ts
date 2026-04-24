import { z } from 'zod';

// Schema for client-provided fields (no createdBy)
export const itemClientSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(500),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  image: z.string().url('Image must be a valid URL'),
});

// Full schema for creation (includes createdBy - used internally)
export const itemCreateSchema = itemClientSchema.extend({
  createdBy: z.string().min(1, 'createdBy is required'),
});

// Schema for updates (all optional)
export const itemUpdateSchema = itemClientSchema.partial();

export type ItemClientInput = z.infer<typeof itemClientSchema>;
export type ItemCreateInput = z.infer<typeof itemCreateSchema>;
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>;
