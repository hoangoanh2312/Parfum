import bcrypt from 'bcryptjs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
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

export async function addAddress(
  userId: string,
  input: { label: string; phone: string; detail: string },
) {
  const user: any = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  user.addresses.push({
    label: input.label.trim(),
    phone: input.phone.trim(),
    detail: input.detail.trim(),
  });
  await user.save();
  return user.addresses;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  input: { label: string; phone: string; detail: string },
) {
  const user: any = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const address = user.addresses.id(addressId);
  if (!address) throw Object.assign(new Error('Address not found'), { status: 404 });

  address.set({
    label: input.label.trim(),
    phone: input.phone.trim(),
    detail: input.detail.trim(),
  });
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
