import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import uploadRoutes from './routes/upload.routes';

async function bootstrap() {
  await connectDB();
  
  // 1. Tạo biến app từ hàm createApp()
  const app = createApp();
  
  // 2. Đăng ký route upload vào đây
  app.use('/api', uploadRoutes);
  
  // 3. Khởi động server
  app.listen(env.port, () => {
    console.log(`🚀 Server is running on port ${env.port}`);
  });
}

bootstrap();