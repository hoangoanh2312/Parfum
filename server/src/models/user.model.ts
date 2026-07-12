import { Schema, model, InferSchemaType } from "mongoose"

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
				const safeRet = ret as Record<string, unknown>
				delete safeRet.password // chắc chắn không bao giờ lộ password ra API
				delete safeRet.__v
				return safeRet
			},
		},
	},
)

// Suy ra kiểu TypeScript từ schema -> dùng cho cả service/controller
export type UserDoc = InferSchemaType<typeof userSchema>

export const User = model("User", userSchema)
