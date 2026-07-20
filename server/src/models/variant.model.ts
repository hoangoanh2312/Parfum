import { Schema, model, Types } from 'mongoose';

const variantSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true, trim: true },
    size: { type: String, trim: true },
    volume: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Variant = model('Variant', variantSchema);