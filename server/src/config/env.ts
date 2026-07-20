import "dotenv/config"

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
	clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
}
