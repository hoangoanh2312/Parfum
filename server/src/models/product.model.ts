import { Schema, model, Types } from 'mongoose';

const notesSchema = new Schema(
  {
    top: [String],    // nốt hương đầu (bay nhanh ~15–30 phút)
    middle: [String], // nốt hương giữa (30 phút – 2 giờ)
    base: [String],   // nốt hương cuối (lưu lâu nhất)
  },
  { _id: false },
);

const ratingSchema = new Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shortDescription: String,         // tóm tắt ngắn cho card sản phẩm
    brand: { type: Types.ObjectId, ref: 'Brand', required: true },
    category: { type: Types.ObjectId, ref: 'Category', required: true },
    gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
    concentration: {
      type: String,
      enum: ['EDT', 'EDP', 'Parfum', 'EDC', 'Cologne', 'Mist'],
    }, // nồng độ nước hoa
    scentFamily: [String],            // Woody, Floral, Oriental, Aquatic, Chypre...
    notes: notesSchema,
    longevity: { type: Number, min: 1, max: 10 }, // độ lưu hương 1–10
    sillage: { type: Number, min: 1, max: 10 },   // độ toả hương 1–10
    season: [{ type: String, enum: ['spring', 'summer', 'autumn', 'winter'] }],
    occasion: [String],               // daily, office, evening, sport, wedding
    images: [String],
    tags: [String],                   // best-seller, new-arrival, limited...
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: ratingSchema,
    soldCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    meta: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ gender: 1, scentFamily: 1 });

export const Product = model('Product', productSchema);
