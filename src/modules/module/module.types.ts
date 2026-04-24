import { Document } from 'mongoose';

export interface IModule extends Document {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number;
  image: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new module (without _id, createdAt, updatedAt)
export type ModuleCreateInput = Omit<IModule, '_id' | 'createdAt' | 'updatedAt'>;

// Type for updating a module (all fields optional)
export type ModuleUpdateInput = Partial<Omit<IModule, '_id' | 'createdAt' | 'createdBy'>>;

// Type for module response (excluding internal MongoDB fields)
export type ModuleResponse = Omit<IModule, '_id'>;
