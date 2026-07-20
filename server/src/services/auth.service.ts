import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';
import { sendMail } from '../utils/mailer';
import { AddressInput } from '../types/dto';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function register(name: string, email: string, password: string) {
  const exists = await User.findOne({ email });
  if (exists) throw Object.assign(new Error('Email da ton tai'), { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  // Gui email xac thuc (khong chan luong dang ky neu SMTP chua cau hinh)
  void sendEmailVerification(String(user._id)).catch(() => null);
  return issueTokens(user);
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw Object.assign(new Error('Sai thong tin dang nhap'), { status: 401 });
  const ok = await bcrypt.compare(password, user.password as string);
  if (!ok) throw Object.assign(new Error('Sai thong tin dang nhap'), { status: 401 });
  await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });
  return issueTokens(user);
}

export async function refreshAccessToken(refreshToken: string) {
  let payload: { id: string };
  try {
    payload = verifyRefresh(refreshToken) as { id: string };
  } catch (e) {
    const err = e as JsonWebTokenError | TokenExpiredError;
    throw Object.assign(new Error(err.message || 'Invalid refresh token'), { status: 401 });
  }
  const user = await User.findById(payload.id).select('+refreshToken');
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

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
}

export async function updateProfile(userId: string, input: { name: string; email: string }) {
  const email = input.email.trim().toLowerCase();
  const exists = await User.findOne({ email, _id: { $ne: userId } });
  if (exists) throw Object.assign(new Error('Email da ton tai'), { status: 409 });

  const user = await User.findByIdAndUpdate(
    userId,
    { name: input.name.trim(), email },
    { new: true, runValidators: true },
  );
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
}

export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string },
) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const ok = await bcrypt.compare(input.currentPassword, user.password as string);
  if (!ok) throw Object.assign(new Error('Mat khau hien tai khong dung'), { status: 400 });

  user.password = await bcrypt.hash(input.newPassword, 10);
  await user.save();
  return { message: 'Password updated' };
}

// ---- Dia chi: mot shape thong nhat (fullName, phone, line, ward, district, province) ----
// Tuong thich nguoc: neu client cu gui { detail } -> map sang line.
function normalizeAddress(input: AddressInput) {
  const line = (input.line ?? input.detail ?? '').trim();
  return {
    label: (input.label || 'Nha').trim(),
    fullName: (input.fullName || '').trim(),
    phone: (input.phone || '').trim(),
    line,
    ward: (input.ward || '').trim(),
    district: (input.district || '').trim(),
    province: (input.province || '').trim(),
    isDefault: !!input.isDefault,
  };
}

export async function addAddress(userId: string, input: AddressInput) {
  const user: any = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const addr = normalizeAddress(input);
  if (addr.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((a: any) => (a.isDefault = false));
    addr.isDefault = true;
  }
  user.addresses.push(addr);
  await user.save();
  return user.addresses;
}

export async function updateAddress(userId: string, addressId: string, input: AddressInput) {
  const user: any = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const address = user.addresses.id(addressId);
  if (!address) throw Object.assign(new Error('Address not found'), { status: 404 });

  const addr = normalizeAddress(input);
  if (addr.isDefault) {
    user.addresses.forEach((a: any) => (a.isDefault = false));
  }
  address.set(addr);
  await user.save();
  return user.addresses;
}

export async function deleteAddress(userId: string, addressId: string) {
  const user: any = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const address = user.addresses.id(addressId);
  if (!address) throw Object.assign(new Error('Address not found'), { status: 404 });

  address.deleteOne();
  await user.save();
  return user.addresses;
}

export async function setDefaultAddress(userId: string, addressId: string) {
  const user: any = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  let found = false;
  user.addresses.forEach((a: any) => {
    const isTarget = String(a._id) === addressId;
    a.isDefault = isTarget;
    if (isTarget) found = true;
  });
  if (!found) throw Object.assign(new Error('Address not found'), { status: 404 });
  await user.save();
  return user.addresses;
}

// ---- Quen / dat lai mat khau qua email ----
export async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  // Luon tra ve thong bao giong nhau de tranh do email ton tai
  if (user) {
    const raw = crypto.randomBytes(32).toString('hex');
    user.set({
      passwordResetToken: hashToken(raw),
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
    });
    await user.save();
    const link = `${CLIENT_URL}/reset-password?token=${raw}`;
    await sendMail({
      to: user.email as string,
      subject: 'Dat lai mat khau - LEssence Noire',
      html: `<p>Nhan vao lien ket sau de dat lai mat khau (het han sau 1 gio):</p><p><a href="${link}">${link}</a></p>`,
      text: `Dat lai mat khau: ${link}`,
    });
  }
  return { message: 'Neu email ton tai, lien ket dat lai mat khau da duoc gui.' };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select('+password');
  if (!user) throw Object.assign(new Error('Token khong hop le hoac da het han'), { status: 400 });

  user.password = await bcrypt.hash(newPassword, 10);
  user.set({ passwordResetToken: undefined, passwordResetExpires: undefined, refreshToken: undefined });
  await user.save();
  return { message: 'Dat lai mat khau thanh cong' };
}

// ---- Xac thuc email ----
export async function sendEmailVerification(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  if (user.isEmailVerified) return { message: 'Email da duoc xac thuc' };

  const raw = crypto.randomBytes(32).toString('hex');
  user.set({
    emailVerifyToken: hashToken(raw),
    emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  await user.save();
  const link = `${CLIENT_URL}/verify-email?token=${raw}`;
  await sendMail({
    to: user.email as string,
    subject: 'Xac thuc email - LEssence Noire',
    html: `<p>Nhan vao lien ket sau de xac thuc email (het han sau 24 gio):</p><p><a href="${link}">${link}</a></p>`,
    text: `Xac thuc email: ${link}`,
  });
  return { message: 'Da gui email xac thuc' };
}

export async function verifyEmail(token: string) {
  const user = await User.findOne({
    emailVerifyToken: hashToken(token),
    emailVerifyExpires: { $gt: new Date() },
  });
  if (!user) throw Object.assign(new Error('Token khong hop le hoac da het han'), { status: 400 });

  user.set({ isEmailVerified: true, emailVerifyToken: undefined, emailVerifyExpires: undefined });
  await user.save();
  return { message: 'Xac thuc email thanh cong' };
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
