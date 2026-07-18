import { Schema, model, Types } from 'mongoose';

const wishlistItemSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const wishlistSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [wishlistItemSchema],
  },
  { timestamps: true },
);

wishlistSchema.index({ user: 1 });

export const Wishlist = model('Wishlist', wishlistSchema);
