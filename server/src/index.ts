import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function bootstrap() {
  await connectDB();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`🚀 Server is running on port ${env.port}`);
  });
}

bootstrap();