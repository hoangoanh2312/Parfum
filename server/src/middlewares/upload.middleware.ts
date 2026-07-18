import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env'; // Import đối tượng env bạn đã cấu hình

const hasCloudinaryConfig = Boolean(
  env.cloudinaryName && env.cloudinaryKey && env.cloudinarySecret,
);

if (hasCloudinaryConfig) {
  // Cấu hình bằng đối tượng env thay vì process.env
  cloudinary.config({
    cloud_name: env.cloudinaryName,
    api_key: env.cloudinaryKey,
    api_secret: env.cloudinarySecret,
  });
}

const localUploadDir = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(localUploadDir, { recursive: true });

const cloudinaryStorage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: async () => ({
        folder: 'parfum',
        format: 'jpg',
        public_id: Date.now().toString(),
      }),
    })
  : null;

const localStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, localUploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

<<<<<<< HEAD
export const upload = multer({
  storage: cloudinaryStorage || localStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Chỉ được upload file ảnh'));
      return;
    }
    cb(null, true);
  },
});
=======
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: 'parfum',
    format: 'jpg', 
    public_id: Date.now().toString(),
  }),
});

export const upload = multer({ storage: storage });
>>>>>>> feature/pf-32-category-brand-crud
