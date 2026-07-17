import { Schema, model, Types } from 'mongoose';

const variantSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true },
    size: String,
    volume: String, // 50ml, 100ml
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Variant = model('Variant', variantSchema);
