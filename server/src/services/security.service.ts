import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { User } from '../models/user.model';

// Dam bao LUON co it nhat 1 tai khoan admin de dang nhap trang quan tri.
// Chay tu dong khi server khoi dong (index.ts). Neu chua co -> tao moi.
export async function ensureDefaultAdmin() {
  const email = (env.defaultAdminEmail || 'admin@lessencenoire.vn').toLowerCase();
  const password = env.adminBootstrapPassword || 'Admin@123';
  const hash = await bcrypt.hash(password, 12);

  const existing = await User.findOne({ email }).select('+password');
  if (existing) {
    // Luon dam bao: dung quyen admin + mat khau chuan de CHAC CHAN dang nhap duoc,
    // ngay ca khi tai khoan da ton tai truoc do voi mat khau khac.
    existing.role = 'admin';
    existing.password = hash;
    existing.isEmailVerified = true;
    await existing.save();
    console.log(`[bootstrap] Da dam bao admin (reset mat khau): ${email} / ${password}`);
    return;
  }

  await User.create({
    name: "Admin L'Essence Noire",
    email,
    password: hash,
    role: 'admin',
    isEmailVerified: true,
  });
  console.log(`[bootstrap] Da tao tai khoan admin mac dinh: ${email} / ${password}`);
}

export async function rotateDefaultAdminPassword() {
  if (!env.defaultAdminEmail || !env.adminBootstrapPassword) return;

  const admin = await User.findOne({
    email: env.defaultAdminEmail.toLowerCase(),
    role: 'admin',
  }).select('+password');

  if (!admin?.password) return;

  const usesLegacyPassword = await bcrypt.compare(
    env.legacyAdminPassword,
    admin.password as string,
  );
  if (!usesLegacyPassword) return;

  admin.password = await bcrypt.hash(env.adminBootstrapPassword, 12);
  await admin.save();
  console.log('[security] Default admin password rotated');
}
