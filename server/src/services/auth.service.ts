import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';

export async function register(name: string, email: string, password: string) {
  const exists = await User.findOne({ email });
  if (exists) throw Object.assign(new Error('Email da ton tai'), { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  return issueTokens(user);
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw Object.assign(new Error('Sai thong tin'), { status: 401 });
  const ok = await bcrypt.compare(password, user.password as string);
  if (!ok) throw Object.assign(new Error('Sai thong tin'), { status: 401 });
  return issueTokens(user);
}

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export async function refreshAccessToken(refreshToken: string) {
  let payload: { id: string };
  try {
    payload = verifyRefresh(refreshToken) as { id: string };
  } catch (e) {
    const err = e as JsonWebTokenError | TokenExpiredError;
    throw Object.assign(new Error(err.message || 'Invalid refresh token'), { status: 401 });
  }
  const user = await User.findById(payload.id);
  if (!user?.refreshToken) throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
  const match = await bcrypt.compare(refreshToken, user.refreshToken as string);
  if (!match) throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
  return {
    accessToken: signAccess({ id: user._id, role: user.role }),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
}

export async function logout(userId: string) {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: '' } });
}

async function issueTokens(user: any) {
  const payload = { id: user._id, role: user.role };
  const refreshToken = signRefresh(payload);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await User.findByIdAndUpdate(user._id, { refreshToken: hashedRefreshToken });
  return {
    accessToken: signAccess(payload),
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
}
