import { Schema, model } from 'mongoose';
const s = new Schema({ name: String, slug: { type: String, unique: true }, logo: String }, { timestamps: true });
export const Brand = model('Brand', s);
