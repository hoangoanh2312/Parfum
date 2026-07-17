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
		scentProfile: {
			families: [{ type: String }],
			preferredNotes: [{ type: String }],
			dislikedNotes: [{ type: String }],
		},
		refreshToken: { type: String },
	},
	{
		timestamps: true, // tự thêm createdAt / updatedAt
		toJSON: {
			transform(_doc, ret: any) {
				delete ret.password
				delete ret.refreshToken
				delete ret.__v
				return ret
			},
		},
	},
)

// Suy ra kiểu TypeScript từ schema -> dùng cho cả service/controller
export type UserDoc = InferSchemaType<typeof userSchema>

export const User = model("User", userSchema)
