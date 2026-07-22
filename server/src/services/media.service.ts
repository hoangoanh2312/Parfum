// =============================================================================
//  MEDIA SERVICE — quan ly toan bo anh he thong tren Cloudinary
//  Cung cap: trang thai cau hinh, liet ke anh (co phan trang), xoa anh.
// =============================================================================
import {
  cloudinary,
  isAdminMediaFolder,
  isCloudinaryConfigured,
  CLOUDINARY_FOLDER,
} from '../config/cloudinary';
import { env } from '../config/env';

function httpError(message: string, status = 400) {
  return Object.assign(new Error(message), { status });
}

function ensureConfigured() {
  if (!isCloudinaryConfigured) {
    throw httpError(
      'Cloudinary chua duoc cau hinh. Hay them CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET vao file .env cua server roi khoi dong lai.',
      503,
    );
  }
}

export type MediaImage = {
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
};

export function getStatus() {
  return {
    configured: isCloudinaryConfigured,
    cloudName: env.cloudinaryName || null,
    folder: CLOUDINARY_FOLDER,
  };
}

export async function listImages(params: { nextCursor?: string; max?: number; folder?: string }) {
  ensureConfigured();
  const max = Math.min(Math.max(Number(params.max) || 30, 1), 100);
  const requestedFolder = String(params.folder || '').trim();
  if (requestedFolder && !isAdminMediaFolder(requestedFolder)) {
    throw httpError('Thu muc anh khong hop le', 400);
  }
  const assetFolder = requestedFolder
    ? `${CLOUDINARY_FOLDER}/${requestedFolder}`
    : CLOUDINARY_FOLDER;
  let res: any;
  try {
    // Dynamic folder mode: asset_folder doc lap voi public_id, nen prefix se bo sot anh.
    res = await cloudinary.api.resources_by_asset_folder(assetFolder, {
      resource_type: 'image',
      type: 'upload',
      max_results: max,
      next_cursor: params.nextCursor || undefined,
      direction: 'desc',
    });
  } catch (error: any) {
    // Tai khoan Cloudinary legacy fixed-folder khong ho tro asset_folder.
    if (![400, 404].includes(Number(error?.error?.http_code || error?.http_code))) throw error;
    res = await cloudinary.api.resources({
      resource_type: 'image',
      type: 'upload',
      prefix: `${assetFolder}/`,
      max_results: max,
      next_cursor: params.nextCursor || undefined,
      direction: 'desc',
    });
  }
  const images: MediaImage[] = (res.resources || []).map((r: any) => ({
    publicId: r.public_id,
    url: r.secure_url || r.url,
    format: r.format,
    width: r.width,
    height: r.height,
    bytes: r.bytes,
    createdAt: r.created_at,
  }));
  // Moi nhat len dau (public_id sinh theo timestamp nen sort desc theo createdAt)
  images.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return {
    images,
    nextCursor: (res.next_cursor as string) || null,
    folder: assetFolder,
  };
}

export async function deleteImage(publicId: string) {
  ensureConfigured();
  if (!publicId) throw httpError('Thieu publicId', 400);
  const res: any = await cloudinary.uploader.destroy(publicId, { invalidate: true });
  if (res.result !== 'ok' && res.result !== 'not found') {
    throw httpError('Xoa anh that bai: ' + res.result, 400);
  }
  return { publicId, result: res.result };
}
