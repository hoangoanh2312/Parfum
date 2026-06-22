import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hoc_parfum',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
