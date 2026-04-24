import { z } from 'zod';

// Schema for client-provided fields (no createdBy)
export const moduleClientSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(500),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  image: z.string().url('Image must be a valid URL'),
});

// Full schema for creation (includes createdBy - used internally)
export const moduleCreateSchema = moduleClientSchema.extend({
  createdBy: z.string().min(1, 'createdBy is required'),
});

// Schema for updates (all optional)
export const moduleUpdateSchema = moduleClientSchema.partial();

export type ModuleClientInput = z.infer<typeof moduleClientSchema>;
export type ModuleCreateInput = z.infer<typeof moduleCreateSchema>;
export type ModuleUpdateInput = z.infer<typeof moduleUpdateSchema>;
