import { Schema, model } from 'mongoose';
const s = new Schema({ name: String, slug: { type: String, unique: true } }, { timestamps: true });
export const Category = model('Category', s);
