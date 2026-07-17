import { Schema, model, Types } from 'mongoose';

const variantSchema = new Schema(
  {
<<<<<<< HEAD
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true },
    size: String,
    volume: String, // 50ml, 100ml
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
    isActive: { type: Boolean, default: true },
=======
    product: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    volume: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
  },
  { timestamps: true },
);

export const Variant = model('Variant', variantSchema);