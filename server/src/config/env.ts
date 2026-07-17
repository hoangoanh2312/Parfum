import "dotenv/config" // nạp .env vào process.env ngay khi import

/**
 * Đọc 1 biến môi trường bắt buộc. Nếu thiếu -> báo lỗi rõ ngay lúc khởi động.
 */
function required(key: string): string {
	const value = process.env[key]
	if (!value) {
		throw new Error(`❌ Thiếu biến môi trường: ${key} (kiểm tra file .env)`)
	}
	return value
}

export const env = {
	nodeEnv: process.env.NODE_ENV ?? "development",
	port: Number(process.env.PORT ?? 5000),
	mongoUri: required("MONGO_URI"),
	jwtAccessSecret: required("JWT_ACCESS_SECRET"),
	jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
	clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
	cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinaryKey: process.env.CLOUDINARY_API_KEY,
	cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
}

