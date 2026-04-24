import { Document, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  image: string;
  createdBy: string;
  modules: Array<{
    module: Types.ObjectId;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseCreateInput = Omit<ICourse, '_id' | 'createdAt' | 'updatedAt' | 'modules'>;
export type CourseUpdateInput = Partial<Omit<ICourse, '_id' | 'createdAt' | 'createdBy' | 'modules'>>;
export type CourseResponse = Omit<ICourse, '_id' | '__v'>;

// For linking modules to courses
export interface CourseModuleLink {
  moduleId: Types.ObjectId;
  order: number;
}

export interface CourseWithModules extends ICourse {
  modules: Array<{
    module: Types.ObjectId;
    order: number;
  }>;
}
