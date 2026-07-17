import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { User } from '../models/user.model';

export async function rotateDefaultAdminPassword() {
  if (!env.defaultAdminEmail || !env.adminBootstrapPassword) return;

  const admin = await User.findOne({
    email: env.defaultAdminEmail.toLowerCase(),
    role: 'admin',
  }).select('+password');

  if (!admin?.password) return;

  const usesLegacyPassword = await bcrypt.compare(env.legacyAdminPassword, admin.password as string);
  if (!usesLegacyPassword) return;

  admin.password = await bcrypt.hash(env.adminBootstrapPassword, 12);
  await admin.save();
  console.log('[security] Default admin password rotated');
}
