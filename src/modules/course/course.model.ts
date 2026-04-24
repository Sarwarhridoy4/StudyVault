import mongoose, { Schema, Document } from 'mongoose';

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
    module:mongoose.Types.ObjectId;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    createdBy: { type: String, required: true },
    modules: [
      {
        module: { type: Schema.Types.ObjectId, required: true, ref: 'Module' },
        order: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
