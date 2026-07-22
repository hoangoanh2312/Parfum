// =============================================================================
//  UPLOAD MIDDLEWARE (multer + Cloudinary storage)
//  Dung chung cloudinary da cau hinh o config/cloudinary.ts.
// =============================================================================
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary, CLOUDINARY_FOLDER, isAdminMediaFolder } from '../config/cloudinary';

function createImageUpload(assetFolder: string) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      asset_folder: assetFolder,
      resource_type: 'image',
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    }),
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Chi chap nhan file anh'));
    },
  });
}

export const upload = createImageUpload(CLOUDINARY_FOLDER);

const scopedStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req) => {
    const folder = String(req.params.folder || '');
    if (!isAdminMediaFolder(folder)) throw new Error('Thu muc anh khong hop le');
    return {
      asset_folder: `${CLOUDINARY_FOLDER}/${folder}`,
      resource_type: 'image',
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    };
  },
});

export const scopedUpload = multer({
  storage: scopedStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Chi chap nhan file anh'));
  },
});

// Anh khach gui kem danh gia duoc tach rieng de de quan ly tren Cloudinary.
export const reviewUpload = createImageUpload(`${CLOUDINARY_FOLDER}/feed back`);
