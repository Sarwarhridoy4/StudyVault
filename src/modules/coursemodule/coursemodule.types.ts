import { Document, Types } from 'mongoose';

export interface ICourseModule extends Document {
  courseId: Types.ObjectId;
  moduleId: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseModuleCreateInput = Omit<ICourseModule, '_id' | 'createdAt' | 'updatedAt'>;
export type CourseModuleUpdateInput = Partial<Omit<ICourseModule, '_id' | 'createdAt' | 'updatedAt'>>;
export type CourseModuleResponse = Omit<ICourseModule, '_id' | '__v'>;
