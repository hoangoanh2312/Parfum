import { Schema, model, Types } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    icon: String,              // tên icon hoặc URL svg
    parent: { type: Types.ObjectId, ref: 'Category', default: null }, // danh mục cha (null = root)
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    meta: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true },
);

export const Category = model('Category', categorySchema);
