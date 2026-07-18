import { Schema, model, InferSchemaType } from 'mongoose';

const addressSchema = new Schema(
  {
    label: { type: String, default: 'Nhà' }, // Nhà / Văn phòng / Khác
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line: { type: String, required: true }, // số nhà, tên đường
    ward: String, // phường/xã
    district: String, // quận/huyện
    province: String, // tỉnh/thành
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const scentProfileSchema = new Schema(
  {
    families: [String], // Chypre, Fougère, Oriental, Floral, Aquatic, Woody...
    preferredNotes: [String], // Sandalwood, Rose, Bergamot...
    dislikedNotes: [String],
    intensity: { type: String, enum: ['light', 'moderate', 'strong'] },
    occasion: [String], // daily, office, evening, sport
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, trim: true },
    avatar: String,
    isEmailVerified: { type: Boolean, default: false },
    loyaltyPoints: { type: Number, default: 0, min: 0 },
    addresses: [addressSchema],
    scentProfile: scentProfileSchema,
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);
