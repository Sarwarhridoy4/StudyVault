import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseModule extends Document {
  courseId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseModuleSchema = new Schema<ICourseModule>(
  {
    courseId: { type: Schema.Types.ObjectId, required: true, ref: 'Course' },
    moduleId: { type: Schema.Types.ObjectId, required: true, ref: 'Module' },
    order: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate links
CourseModuleSchema.index({ courseId: 1, moduleId: 1 }, { unique: true });

const CourseModule = mongoose.model<ICourseModule>('CourseModule', CourseModuleSchema);

export default CourseModule;
