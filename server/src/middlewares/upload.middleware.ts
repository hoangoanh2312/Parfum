import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env'; // Import đối tượng env bạn đã cấu hình

// Cấu hình bằng đối tượng env thay vì process.env
cloudinary.config({
  cloud_name: env.cloudinaryName,
  api_key: env.cloudinaryKey,
  api_secret: env.cloudinarySecret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: 'parfum',
    format: 'jpg', 
    public_id: Date.now().toString(),
  }),
});

export const upload = multer({ storage: storage });
