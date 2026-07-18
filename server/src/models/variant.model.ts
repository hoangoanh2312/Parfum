import { Schema, model, Types } from 'mongoose';

const variantSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
<<<<<<< HEAD
    sku: { type: String, required: true, unique: true, trim: true },
    size: { type: String, trim: true },
    volume: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
=======
    sku: { type: String, required: true, unique: true },
    volume: String, // 50ml, 100ml
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
>>>>>>> feature/pf-32-category-brand-crud
  },
  { timestamps: true },
);

export const Variant = model('Variant', variantSchema);
