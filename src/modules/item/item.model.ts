import mongoose, { Schema } from 'mongoose';
import type { IItem, ItemCreateInput, ItemUpdateInput, ItemResponse } from './item.types';

const ItemSchema = new Schema<IItem>(
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
ItemSchema.index({ title: 'text', shortDescription: 'text' }); // Text search index
ItemSchema.index({ category: 1 }); // Filter by category
ItemSchema.index({ price: 1 }); // Price range queries
ItemSchema.index({ createdAt: -1 }); // Sorting by latest
ItemSchema.index({ createdBy: 1 }); // Finding user's items

const Item = mongoose.model<IItem>('Item', ItemSchema);

export default Item;
export type { IItem } from './item.types';
export type { ItemCreateInput, ItemUpdateInput, ItemResponse } from './item.types';
