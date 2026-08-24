import { Schema, model } from 'mongoose';

const guestOrderLookupSchema = new Schema(
  {
    lookupIdHash: { type: String, required: true, unique: true, select: false },
    contactKey: { type: String, required: true, index: true },
    email: { type: String, select: false },
    phone: { type: String, select: false },
    otpHash: { type: String, required: true, select: false },
    matched: { type: Boolean, required: true, default: false, select: false },
    attempts: { type: Number, required: true, default: 0, min: 0 },
    otpExpiresAt: { type: Date, required: true },
    consumedAt: Date,
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

guestOrderLookupSchema.index({ contactKey: 1, createdAt: -1 });
guestOrderLookupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const GuestOrderLookup = model('GuestOrderLookup', guestOrderLookupSchema);
