import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  image: string;
  imagePublicId?: string;  // Store Cloudinary public_id for image management
  createdBy: string;
  modules: mongoose.Types.ObjectId[];  // Simple array of module ObjectIds
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
    imagePublicId: { type: String },
    createdBy: { type: String, required: true },
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
