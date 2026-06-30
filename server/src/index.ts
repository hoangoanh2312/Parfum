import { env } from "./config/env" // import ĐẦU TIÊN để nạp .env trước mọi thứ
import { connectDB } from "./config/db"

// Lưu ý: file ./app (khởi tạo Express app) thuộc skeleton HT-05.
// Ở đây minh họa cách ráp connectDB vào điểm khởi động.
import { createApp } from "./app"

async function start() {
	await connectDB()
	const app = createApp()
	app.listen(env.port, () =>
		console.log(`🚀 Server: http://localhost:${env.port}`),
	)
}

start()
