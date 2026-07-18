import { Schema, model, Types } from 'mongoose';

const reviewSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    order: { type: Types.ObjectId, ref: 'Order' },   // liên kết đơn hàng để xác minh mua hàng
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,                                    // tiêu đề ngắn (optional)
    comment: { type: String, required: true },
    images: [String],
    isVerifiedPurchase: { type: Boolean, default: false }, // đã mua sản phẩm này
    isApproved: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },       // số người thấy review hữu ích
    reportCount: { type: Number, default: 0 },
    adminReply: {
      content: String,
      repliedAt: Date,
      repliedBy: { type: Types.ObjectId, ref: 'User' },
    },
  },
  { timestamps: true },
);

reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ user: 1 });
// Mỗi user chỉ review 1 lần mỗi sản phẩm (theo order)
reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true, sparse: true });

export const Review = model('Review', reviewSchema);