import { Schema, model, Types } from 'mongoose';

const paymentSchema = new Schema(
  {
    order: { type: Types.ObjectId, ref: 'Order', required: true },
    method: { type: String, enum: ['cod', 'bank_qr'], default: 'cod' },
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const Payment = model('Payment', paymentSchema);
