import { env } from './config/env'; // import ĐẦU TIÊN để nạp .env trước mọi thứ
import { connectDB } from './config/db';

// Lưu ý: file ./app (khởi tạo Express app) thuộc skeleton HT-05.
// Ở đây minh họa cách ráp connectDB vào điểm khởi động.
import { createApp } from './app';
import {
  rotateDefaultAdminPassword,
  ensureDefaultAdmin,
  fixLegacySlugIndexes,
} from './services/security.service';

async function start() {
  const app = createApp();
  const server = app.listen(env.port, () =>
    console.log(`🚀 Server: http://localhost:${env.port}`),
  );

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${env.port} dang duoc su dung. Hay tat server cu hoac doi PORT trong server/.env.`,
      );
      process.exit(1);
    }
    throw error;
  });

  try {
    await connectDB();
    await ensureDefaultAdmin();
    await rotateDefaultAdminPassword();
    await fixLegacySlugIndexes();
  } catch (error) {
    console.error('Khong khoi tao duoc database/bootstrap:', error);
    process.exit(1);
  }
}

start();
