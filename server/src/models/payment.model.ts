import { Schema, model, Types } from 'mongoose';

const paymentSchema = new Schema(
  {
    order: { type: Types.ObjectId, ref: 'Order', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    method: {
      type: String,
      enum: ['cod', 'bank_qr', 'momo', 'vnpay'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'unpaid'],
      default: 'pending',
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'VND' },
    transactionRef: String,    // mã giao dịch từ cổng thanh toán
    gatewayResponse: Schema.Types.Mixed, // raw response từ MoMo/VNPay
    paidAt: Date,
    refundedAt: Date,
    refundReason: String,
    note: String,
  },
  { timestamps: true },
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionRef: 1 });

export const Payment = model('Payment', paymentSchema);
