import mongoose, { Schema, Document } from 'mongoose';

export interface IStudy extends Document {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  image: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudySchema = new Schema<IStudy>(
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
  },
  { timestamps: true }
);

const Study = mongoose.model<IStudy>('Study', StudySchema);

export default Study;
