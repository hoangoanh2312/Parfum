import 'dotenv/config'; // nap .env vao process.env ngay khi import

/**
 * Doc 1 bien moi truong bat buoc. Neu thieu -> bao loi ro ngay luc khoi dong.
 */
function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Thieu bien moi truong: ${key} (kiem tra file .env)`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required('MONGO_URI'),
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  // pf52: danh sach origin duoc phep (CORS allowlist)
  allowedOrigins: (process.env.CORS_ORIGINS || process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  // pf54: Cloudinary (upload anh)
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET || '',
  // pf54: VietQR (demo) cho thanh toan chuyen khoan QR
  vietqr: {
    bankBin: process.env.VIETQR_BANK_BIN || '970415',
    accountNo: process.env.VIETQR_ACCOUNT_NO || '0000000000',
    accountName: process.env.VIETQR_ACCOUNT_NAME || 'HOC PARFUM DEMO',
  },
  // pf52: bootstrap doi mat khau admin mac dinh
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || '',
  legacyAdminPassword: process.env.LEGACY_ADMIN_PASSWORD || 'admin123456',
  adminBootstrapPassword: process.env.ADMIN_BOOTSTRAP_PASSWORD || '',
};
