import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function bootstrap() {
  await connectDB();
  createApp().listen(env.port, () => console.log(`[server] http://localhost:${env.port}`));
}
bootstrap();
