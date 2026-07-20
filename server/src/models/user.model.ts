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
		password: { type: String, required: true, select: false }, // mặc định KHÔNG trả về
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
		addresses: [{ label: String, phone: String, detail: String }],
	},
	{
		timestamps: true, // tự thêm createdAt / updatedAt
		toJSON: {
			transform(_doc, ret) {
				const { password: _password, __v, ...safe } = ret
				return safe
			},
		},
	},
)

export type UserDoc = InferSchemaType<typeof userSchema>;

export const User = model('User', userSchema);
