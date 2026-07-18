import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { User } from '../models/user.model';
import Brand from '../models/brand.model';
import Category from '../models/category.model';

// Tao slug tu ten (bo dau tieng Viet, ky tu dac biet -> gach ngang).
function slugify(input: string) {
  return String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Sua loi E11000 dup key { slug: null } tren brands/categories:
// 1) Xoa index cu 'slug_1' (unique, KHONG sparse) neu con sot lai tu schema cu.
// 2) Dien slug cho cac ban ghi dang thieu / null.
// 3) Dong bo lai index theo schema moi (unique + sparse).
export async function fixLegacySlugIndexes() {
  const models: Array<{ Model: any; label: string }> = [
    { Model: Brand, label: 'brands' },
    { Model: Category, label: 'categories' },
  ];

  for (const { Model, label } of models) {
    const coll = Model.collection;

    // 1) Xoa index cu non-sparse neu ton tai
    try {
      const indexes: any[] = await coll.indexes();
      const legacy = indexes.find((i) => i.name === 'slug_1' && !i.sparse);
      if (legacy) {
        await coll.dropIndex('slug_1');
        console.log(`[migrate] Da xoa index cu slug_1 tren ${label}`);
      }
    } catch {
      // khong co index -> bo qua
    }

    // 2) Dien slug cho ban ghi thieu/null
    const docs: any[] = await Model.find({
      $or: [{ slug: null }, { slug: { $exists: false } }, { slug: '' }],
    });
    for (const doc of docs) {
      const base = slugify(doc.name) || 'muc';
      let slug = base;
      let i = 1;
      // eslint-disable-next-line no-await-in-loop
      while (await Model.findOne({ slug, _id: { $ne: doc._id } }).select('_id').lean()) {
        slug = `${base}-${i++}`;
      }
      doc.slug = slug;
      // eslint-disable-next-line no-await-in-loop
      await doc.save();
    }
    if (docs.length) console.log(`[migrate] Da dien slug cho ${docs.length} ban ghi ${label}`);

    // 3) Dong bo index theo schema moi (unique + sparse)
    try {
      await Model.syncIndexes();
    } catch (e) {
      console.warn(`[migrate] syncIndexes ${label} loi (bo qua):`, (e as Error).message);
    }
  }
}

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
