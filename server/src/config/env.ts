import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hoc_parfum',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  // THÊM 3 DÒNG NÀY VÀO ĐÂY:
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET
};