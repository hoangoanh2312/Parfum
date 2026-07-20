import { Schema, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    // sparse: true → cho phép nhiều document có slug = null mà không bị E11000
    slug: { type: String, unique: true, sparse: true, trim: true },
    logo: { type: String, default: null },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Brand = model('Brand', brandSchema);
