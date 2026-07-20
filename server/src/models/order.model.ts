import { Schema, model, Types } from 'mongoose';

// Mỗi dòng hàng trong đơn: LƯU SNAPSHOT (name/volume/price) tại thời điểm đặt
// để sau này sản phẩm đổi giá/tên thì đơn cũ vẫn giữ đúng dữ liệu lúc mua.
const orderItemSchema = new Schema(
  {
    variant: { type: Types.ObjectId, ref: 'Variant', required: true },
    name: String,
    volume: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User' },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    voucherCode: { type: String, trim: true, uppercase: true },
    pointsEarned: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipping', 'done', 'cancelled'],
      default: 'pending',
    },
    address: {
      fullName: String,
      phone: String,
      line: String,
      ward: String,
      district: String,
      province: String,
      city: String,
    },
    note: String,
  },
  { timestamps: true },
);

export const Order = model('Order', orderSchema);