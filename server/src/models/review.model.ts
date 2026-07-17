import { Schema, model, Types } from 'mongoose';
const s = new Schema({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  user: { type: Types.ObjectId, ref: 'User' },
  guestName: { type: String, trim: true },
  guestEmail: { type: String, trim: true, lowercase: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  images: [String],
  approved: { type: Boolean, default: false },
}, { timestamps: true });
export const Review = model('Review', s);
