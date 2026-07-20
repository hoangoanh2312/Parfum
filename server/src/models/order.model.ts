import { Schema, model, Types } from 'mongoose';
const s = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  items: [{ variant: { type: Types.ObjectId, ref: 'Variant' }, name: String, price: Number, quantity: Number }],
  total: Number,
  status: { type: String, enum: ['pending','paid','shipping','done','cancelled'], default: 'pending' },
  address: { line: String, city: String, phone: String },
}, { timestamps: true });
export const Order = model('Order', s);
