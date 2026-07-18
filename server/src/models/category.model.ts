import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Category', categorySchema);
