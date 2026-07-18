import { Schema, model, Types } from 'mongoose';

// Mỗi user có 1 giỏ hàng (unique theo user).
// Chỉ lưu variant + quantity; giá/tên/ảnh sẽ populate động khi trả về
// để luôn hiển thị giá mới nhất (khác với Order lưu snapshot).
const cartItemSchema = new Schema(
  {
    variant: { type: Types.ObjectId, ref: 'Variant', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
);

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true },
);

export const Cart = model('Cart', cartSchema);
