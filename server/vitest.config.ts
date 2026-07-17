import { defineConfig } from 'vitest/config';

// PF-43: cau hinh test co ban
export default defineConfig({
  test: {
    environment: 'node',
    // Bien moi truong toi thieu de config/env.ts khong throw khi chay test
    env: {
      MONGO_URI: 'mongodb://localhost:27017/parfum-shop-test',
      JWT_ACCESS_SECRET: 'test_access_secret',
      JWT_REFRESH_SECRET: 'test_refresh_secret',
      CLIENT_URL: 'http://localhost:5173',
    },
  },
});
