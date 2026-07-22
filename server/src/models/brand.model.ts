import { Schema, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // slug dung cho URL. unique + sparse: khong chan cac ban ghi chua co slug
    // (sparse bo qua document khong co truong slug -> tranh loi E11000 dup null).
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: { type: String, trim: true, default: '' },
    logo: { type: String, trim: true, default: '' },
    heroImage: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    foundedYear: { type: Number, min: 1000, max: 3000 },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Brand = model('Brand', brandSchema);
export default Brand;
