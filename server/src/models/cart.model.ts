import { Schema, model, Types } from 'mongoose';

const cartItemSchema = new Schema(
  {
    variant: { type: Types.ObjectId, ref: 'Variant', required: true },
    product: { type: Types.ObjectId, ref: 'Product', required: true }, // denorm để query nhanh
    quantity: { type: Number, required: true, min: 1 },
    priceAtAdd: { type: Number, required: true }, // giá lúc thêm vào giỏ
  },
  { _id: true },
);

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    couponCode: String,                       // mã coupon đang áp dụng
    couponDiscount: { type: Number, default: 0 }, // số tiền được giảm
    note: String,                             // ghi chú đơn hàng
    expiresAt: Date,                          // tự động xoá giỏ khách sau N ngày
  },
  { timestamps: true },
);

cartSchema.index({ user: 1 });

export const Cart = model('Cart', cartSchema);
