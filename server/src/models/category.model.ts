import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    // sparse: true → cho phép nhiều document có slug = null mà không bị E11000
    slug: { type: String, unique: true, sparse: true, trim: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Category = model('Category', categorySchema);
