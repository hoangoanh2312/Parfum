// =============================================================================
//  UPLOAD MIDDLEWARE (multer + Cloudinary storage)
//  Dung chung cloudinary da cau hinh o config/cloudinary.ts.
// =============================================================================
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary, CLOUDINARY_FOLDER } from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: CLOUDINARY_FOLDER,
    resource_type: 'image',
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // gioi han 5MB / anh
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chi chap nhan file anh'));
  },
});
