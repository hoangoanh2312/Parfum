import { Schema, model, Types } from 'mongoose';
const s = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  items: [{ variant: { type: Types.ObjectId, ref: 'Variant' }, quantity: Number }],
}, { timestamps: true });
export const Cart = model('Cart', s);
