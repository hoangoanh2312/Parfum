const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'dwj2trmn0';
const AUTO = 'q_auto,f_auto';

// Hàm xóa đuôi file (giữ nguyên để bạn truyền đuôi .png/.jpg vào code vẫn không bị lỗi)
function basenameNoExt(filename: string): string {
  return filename.replace(/\.(png|jpe?g|webp|avif|gif)$/i, '');
}

/**
 * 1. CÁC HÀM CHO TRANG HOME
 */
export function homeBanner(filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/home/banner/${id}`;
}

export function homeCollection(filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/home/bộ sưu tập/${id}`;
}

/**
 * 2. CÁC HÀM CHO TRANG PRODUCTS
 */
export function productBanner(filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/products/banner/${id}`;
}

export function productImage(filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/products/products/${id}`;
}

/**
 * 3. CÁC HÀM CHO CÁC TRANG CÒN LẠI (Tự động thêm nếu sau này bạn tạo folder con banner)
 */
export function aboutImage(folder: 'banner' | string, filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/about/${folder}/${id}`;
}

export function newsImage(folder: 'banner' | string, filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/news/${folder}/${id}`;
}

export function brandImage(folder: 'banner' | string, filename: string): string {
  const id = basenameNoExt(filename);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${AUTO}/perfumeshop/brand/${folder}/${id}`;
}