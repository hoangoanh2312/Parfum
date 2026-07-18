import { Schema, model, Types } from 'mongoose';

const orderItemSchema = new Schema(
  {
    variant: { type: Types.ObjectId, ref: 'Variant' },
    product: { type: Types.ObjectId, ref: 'Product' },
    sku: String,
    productName: { type: String, required: true }, // snapshot tên tại thời điểm đặt
    volume: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true }, // price * quantity
  },
  { _id: true },
);

const shippingAddressSchema = new Schema(
  {
    fullName: String,
    phone: String,
    line: String,
    ward: String,
    district: String,
    province: String,
  },
);

const orderSchema = new Schema(
  {
    orderCode: { type: String, unique: true }, // mã đơn dễ đọc: ORD-20240718-0001
    user: { type: Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    subtotal: { type: Number, required: true },    // tổng trước giảm giá + phí ship
    shippingFee: { type: Number, default: 0 },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true },        // subtotal + shippingFee - couponDiscount
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['cod', 'bank_qr', 'momo', 'vnpay'], default: 'cod' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
    trackingCode: String,                          // mã vận đơn
    shippingProvider: String,                      // GHN, GHTK, Viettel Post...
    note: String,
    cancelReason: String,
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderCode: 1 });

export const Order = model('Order', orderSchema);
