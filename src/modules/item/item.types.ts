import { Document } from 'mongoose';

export interface IItem extends Document {
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

// Type for creating a new item (without _id, createdAt, updatedAt)
export type ItemCreateInput = Omit<IItem, '_id' | 'createdAt' | 'updatedAt'>;

// Type for updating an item (all fields optional)
export type ItemUpdateInput = Partial<Omit<IItem, '_id' | 'createdAt' | 'createdBy'>>;

// Type for item response (excluding internal MongoDB fields)
export type ItemResponse = Omit<IItem, '_id'>;
