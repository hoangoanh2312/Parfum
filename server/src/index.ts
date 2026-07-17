import { env } from "./config/env" // import ĐẦU TIÊN để nạp .env trước mọi thứ
import { connectDB } from "./config/db"

// Lưu ý: file ./app (khởi tạo Express app) thuộc skeleton HT-05.
// Ở đây minh họa cách ráp connectDB vào điểm khởi động.
import { createApp } from "./app"
import { rotateDefaultAdminPassword } from "./services/security.service"

async function start() {
	await connectDB()
	await rotateDefaultAdminPassword()
	const app = createApp()
	app.listen(env.port, () =>
		console.log(`🚀 Server: http://localhost:${env.port}`),
	)
}

start()
