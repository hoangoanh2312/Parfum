import "dotenv/config"

function required(key: string): string {
	const value = process.env[key]
	if (!value) {
		throw new Error(`❌ Thiếu biến môi trường: ${key} (kiểm tra file .env)`)
	}
	return value
}

export const env = {
<<<<<<< HEAD
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required('MONGO_URI'),
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET || '',
  // PF-36: cấu hình VietQR (demo) cho thanh toán chuyển khoản QR
  vietqr: {
    bankBin: process.env.VIETQR_BANK_BIN || '970415',
    accountNo: process.env.VIETQR_ACCOUNT_NO || '0000000000',
    accountName: process.env.VIETQR_ACCOUNT_NAME || 'HOC PARFUM DEMO',
  },
};
=======
	nodeEnv: process.env.NODE_ENV ?? "development",
	port: Number(process.env.PORT ?? 5000),
	mongoUri: required("MONGO_URI"),
	jwtAccessSecret: required("JWT_ACCESS_SECRET"),
	jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
	// URL frontend — dùng bởi CORS trong app.ts
	clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
}
>>>>>>> feature/pf-32-category-brand-crud
