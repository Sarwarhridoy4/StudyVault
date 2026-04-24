import mongoose, { Schema, Document } from 'mongoose';

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

const ModuleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 500 },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance
ModuleSchema.index({ title: 'text', shortDescription: 'text' }); // Text search index
ModuleSchema.index({ category: 1 }); // Filter by category
ModuleSchema.index({ price: 1 }); // Price range queries
ModuleSchema.index({ createdAt: -1 }); // Sorting by latest
ModuleSchema.index({ createdBy: 1 }); // Finding user's modules

const Module = mongoose.model<IModule>('Module', ModuleSchema);

export default Module;
