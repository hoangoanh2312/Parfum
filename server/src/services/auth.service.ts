import bcrypt from 'bcryptjs';
import type { HydratedDocument } from 'mongoose';
import { User, type UserDoc } from '../models/user.model';
import { signAccess, signRefresh } from '../utils/jwt';

type UserDocument = HydratedDocument<UserDoc>;

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function issueTokens(user: UserDocument) {
  const payload = { id: user._id.toString(), role: user.role };
  return {
    accessToken: signAccess(payload),
    refreshToken: signRefresh(payload),
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function register(name: string, email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) throw Object.assign(new Error('Email da ton tai'), { status: 409 });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hash });
  return issueTokens(user);
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');
  if (!user) throw Object.assign(new Error('Sai thong tin'), { status: 401 });

  const ok = await bcrypt.compare(password, user.password as string);
  if (!ok) throw Object.assign(new Error('Sai thong tin'), { status: 401 });

  return issueTokens(user);
}

export function logout() {
  return { message: 'Dang xuat thanh cong' };
}
