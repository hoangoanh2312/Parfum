import { Schema, model, InferSchemaType } from 'mongoose';

const addressSchema = new Schema(
  {
    label: String,
    phone: String,
    detail: String,
  },
  { _id: true },
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
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    addresses: { type: [addressSchema], default: [] },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export type UserDoc = InferSchemaType<typeof userSchema>;

export const User = model('User', userSchema);
