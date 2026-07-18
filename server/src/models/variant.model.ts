import { Schema, model, Types } from 'mongoose';

const variantSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true },
    volume: { type: String, required: true }, // '30ml', '50ml', '100ml'
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 }, // giá gốc để hiển thị % giảm giá
    costPrice: { type: Number, min: 0 },       // giá vốn (nội bộ, không expose ra client)
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 }, // cảnh báo khi stock <= ngưỡng này
    images: [String],                          // ảnh riêng của variant (optional)
    isActive: { type: Boolean, default: true },
    weight: Number,                            // gram, dùng tính phí ship
    barcode: String,
  },
  { timestamps: true },
);

variantSchema.index({ product: 1 });

export const Variant = model('Variant', variantSchema);