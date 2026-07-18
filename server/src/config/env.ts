import "dotenv/config"; // nạp .env vào process.env ngay khi import

/**
 * Đọc 1 biến môi trường bắt buộc. Nếu thiếu -> báo lỗi rõ ngay lúc khởi động.
 */
function required(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`❌ Thiếu biến môi trường: ${key} (kiểm tra file .env)`);
	}
	return value;
}

export const env = {
	nodeEnv: process.env.NODE_ENV ?? "development",
	port: Number(process.env.PORT ?? 5000),
	clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
	allowedOrigins: (process.env.CORS_ORIGINS || process.env.CLIENT_URL || "http://localhost:5173")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean),
	mongoUri: required("MONGO_URI"),
	jwtAccessSecret: required("JWT_ACCESS_SECRET"),
	jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
	// Cloudinary (dùng cho upload ảnh sản phẩm)
	cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME || "",
	cloudinaryKey: process.env.CLOUDINARY_API_KEY || "",
	cloudinarySecret: process.env.CLOUDINARY_API_SECRET || "",
	defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || "",
	legacyAdminPassword: process.env.LEGACY_ADMIN_PASSWORD || "admin123456",
	adminBootstrapPassword: process.env.ADMIN_BOOTSTRAP_PASSWORD || "",
	// PF-36: cấu hình VietQR (demo) cho thanh toán chuyển khoản QR
	vietqr: {
		bankBin: process.env.VIETQR_BANK_BIN || "970415",
		accountNo: process.env.VIETQR_ACCOUNT_NO || "0000000000",
		accountName: process.env.VIETQR_ACCOUNT_NAME || "HOC PARFUM DEMO",
	},
};