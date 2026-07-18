import { Schema, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    logo: String,
    banner: String,
    description: String,
    country: String,           // France, Italy, Vietnam...
    foundedYear: Number,
    website: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }, // thứ tự hiển thị
    meta: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true },
);

export const Brand = model('Brand', brandSchema);
