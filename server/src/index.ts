import { env } from "./config/env" // import ĐẦU TIÊN để nạp .env trước mọi thứ
import { connectDB } from "./config/db"
import { createApp } from "./app"

async function start() {
	await connectDB()
	const app = createApp()
	app.listen(env.port, () =>
		console.log(`🚀 Server: http://localhost:${env.port}`),
	)
}

start()
