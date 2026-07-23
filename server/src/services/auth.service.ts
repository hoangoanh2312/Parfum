import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt';
import { assertMailConfigured, sendMail } from '../utils/mailer';
import { AddressInput } from '../types/dto';
import { assertValidContact, normalizeEmail, normalizePhone } from '../utils/contactValidation';
import { assertSmsConfigured, sendPasswordResetOtp } from '../utils/sms';
import { ensureWelcomeVoucher, WELCOME_VOUCHER_CODE } from './promotion.service';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const PROFILE_COMPLETION_VOUCHER_CODE = 'NEWPROFILE10';

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function profileIsComplete(user: any) {
  const hasName = String(user?.name || '').trim().length >= 2;
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(user?.email || '').trim());
  const hasPhone = /^0\d{9}$/.test(String(user?.phone || '').trim());
  const hasAddress = (user?.addresses || []).some((address: any) =>
    String(address?.phone || '').trim() &&
    String(address?.line || address?.detail || '').trim() &&
    String(address?.ward || '').trim() &&
    String(address?.province || '').trim(),
  );
  return hasName && hasEmail && hasPhone && hasAddress;
}

export async function ensureProfileCompletionVoucher() {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setFullYear(endDate.getFullYear() + 5);

  return Voucher.findOneAndUpdate(
    { code: PROFILE_COMPLETION_VOUCHER_CODE },
    {
      $setOnInsert: {
        code: PROFILE_COMPLETION_VOUCHER_CODE,
        name: 'Voucher người mới hoàn tất hồ sơ',
        type: 'percentage',
        value: 10,
        minOrder: 0,
        maxDiscount: 0,
        startDate: now,
        endDate,
        expiresAt: endDate,
        usageLimit: 0,
        usageLimitPerUser: 1,
        stackable: true,
        userSegment: 'NEW',
        isPrivate: false,
        isActive: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

async function sendProfileCompletionVoucherEmail(user: any, code: string) {
  await sendMail({
    to: String(user.email),
    subject: `${code} - Voucher 10% cho tài khoản mới`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#27231f">
        <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#806b3d">L'Essence Noire</p>
        <h1 style="font-size:28px;font-weight:500">Cảm ơn bạn đã hoàn tất hồ sơ</h1>
        <p>Bạn vừa nhận voucher dành cho khách hàng mới đã cập nhật đầy đủ thông tin.</p>
        <p style="display:inline-block;padding:14px 22px;border:1px solid #806b3d;font-size:22px;letter-spacing:3px;font-weight:700;color:#806b3d">${code}</p>
        <p>Ưu đãi giảm 10%, dùng 1 lần cho tài khoản mới.</p>
      </div>`,
    text: `Cam on ban da hoan tat ho so. Ma voucher 10% cua ban la ${code}.`,
  });
}

async function maybeIssueProfileCompletionVoucher(userId: string) {
  const user: any = await User.findById(userId);
  if (!user || user.profileCompletionVoucherCode || !profileIsComplete(user)) return user;

  const voucher = await ensureProfileCompletionVoucher();
  user.profileCompletedAt = new Date();
  user.profileCompletionVoucherCode = PROFILE_COMPLETION_VOUCHER_CODE;
  await user.save();
  void sendProfileCompletionVoucherEmail(user, voucher.code).catch(() => null);
  return user;
}

async function claimGuestOrdersForUser(user: any, email: string, phone: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedEmail || !normalizedPhone) return 0;

  const guestOrderFilter = {
    $or: [{ user: { $exists: false } }, { user: null }],
    'address.phone': normalizedPhone,
    $and: [
      {
        $or: [
          { 'address.email': normalizedEmail },
          { 'address.email': { $exists: false }, note: { $regex: `Email:\\s*${escapeRegExp(normalizedEmail)}`, $options: 'i' } },
          { 'address.email': '', note: { $regex: `Email:\\s*${escapeRegExp(normalizedEmail)}`, $options: 'i' } },
        ],
      },
    ],
  };

  const guestOrders = await Order.find(guestOrderFilter).select('_id pointsEarned status').lean();
  if (!guestOrders.length) return 0;

  await Order.updateMany(
    { _id: { $in: guestOrders.map((order) => order._id) } },
    { $set: { user: user._id } },
  );

  const claimedPoints = guestOrders.reduce(
    (sum: number, order: any) => sum + (order.status !== 'cancelled' ? Number(order.pointsEarned) || 0 : 0),
    0,
  );
  if (claimedPoints) {
    await User.updateOne({ _id: user._id }, { $inc: { loyaltyPoints: claimedPoints } });
  }

  return guestOrders.length;
}

// Phat voucher chao mung (WELCOME10) NGAY khi khach dang ky tai khoan moi.
// Chi phat 1 lan / tai khoan (dua tren welcomeVoucherIssuedAt).
// Loi gui email khong duoc lam hong luong dang ky/cap nhat.
async function maybeIssueWelcomeVoucher(userId: string) {
  try {
    const user: any = await User.findById(userId);
    if (!user || user.role !== 'customer' || user.welcomeVoucherIssuedAt) return;
    await ensureWelcomeVoucher();
    const firstName = String(user.name || 'ban').trim().split(/\s+/).slice(-1)[0] || 'ban';
    const sent = await sendMail({
      to: user.email,
      subject: `Chao mung ${user.name} den voi L'Essence Noire - Tang ban ma giam 10% ${WELCOME_VOUCHER_CODE}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#27231f;line-height:1.6">
          <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#806b3d">L'Essence Noire</p>
          <h1 style="font-size:26px;font-weight:500;margin:8px 0 16px">Chao mung ban da tham gia!</h1>
          <p>Xin chao ${firstName},</p>
          <p>Cam on ban da tro thanh thanh vien moi cua <strong>L'Essence Noire</strong>. Chung toi co mot ma giam gia danh rieng cho thanh vien moi - ban hay dung ngay hom nay nhe:</p>
          <div style="text-align:center;margin:24px 0;padding:20px;border:1px dashed #b89a4e;border-radius:10px;background:#fbf7ee">
            <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9a8248">Ma danh cho thanh vien moi</p>
            <p style="margin:0;font-size:34px;letter-spacing:8px;font-weight:700;color:#806b3d">${WELCOME_VOUCHER_CODE}</p>
            <p style="margin:8px 0 0;font-size:14px;color:#4a453f">Giam <strong>10%</strong> cho don hang dau tien</p>
          </div>
          <p>Cach dung: nhap ma <strong>${WELCOME_VOUCHER_CODE}</strong> tai buoc thanh toan de duoc giam 10%.</p>
          <p style="color:#777;font-size:12px">Ma ap dung 1 lan cho moi tai khoan thanh vien moi. Chuc ban co trai nghiem mua sam that tuyet voi tai L'Essence Noire!</p>
        </div>`,
      text: `Chao mung ${user.name} den voi L'Essence Noire! Chung toi tang ban ma giam 10% danh cho thanh vien moi: ${WELCOME_VOUCHER_CODE}. Hay dung ngay o buoc thanh toan cho don hang dau tien.`,
    }).catch(() => false);
    // Chi danh dau da phat khi email gui THANH CONG. Neu SMTP loi/chua cau hinh,
    // lan khach cap nhat thong tin sau (SDT / dia chi) se tu dong gui lai WELCOME10.
    if (sent) {
      user.welcomeVoucherIssuedAt = new Date();
      await user.save();
    }
  } catch {
    // Bo qua loi phat voucher de khong chan luong chinh
  }
}

export async function register(name: string, email: string, password: string, phone: string) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  assertValidContact(normalizedEmail, normalizedPhone);

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) throw Object.assign(new Error('Email da ton tai'), { status: 409 });
  const phoneExists = await User.findOne({ phone: normalizedPhone });
  if (phoneExists) throw Object.assign(new Error('So dien thoai da duoc su dung'), { status: 409 });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: normalizedEmail, phone: normalizedPhone, password: hash });
  await claimGuestOrdersForUser(user, normalizedEmail, normalizedPhone);
  // Gui NGAY voucher chao mung (WELCOME10) qua email cho thanh vien moi
  await maybeIssueWelcomeVoucher(String(user._id));
  // Gui email xac thuc (khong chan luong dang ky neu SMTP chua cau hinh)
  void sendEmailVerification(String(user._id)).catch(() => null);
  return issueTokens(user);
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw Object.assign(new Error('Sai thong tin dang nhap'), { status: 401 });
  const ok = await bcrypt.compare(password, user.password as string);
  if (!ok) throw Object.assign(new Error('Sai thong tin dang nhap'), { status: 401 });
  if (user.phone) await claimGuestOrdersForUser(user, user.email as string, user.phone as string);
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
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, isEmailVerified: user.isEmailVerified },
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

export async function updateProfile(userId: string, input: { name: string; email: string; phone?: string }) {
  const email = input.email.trim().toLowerCase();
  const exists = await User.findOne({ email, _id: { $ne: userId } });
  if (exists) throw Object.assign(new Error('Email da ton tai'), { status: 409 });
  const phone = normalizePhone(input.phone || '');
  if (phone) {
    assertValidContact(email, phone);
    const phoneExists = await User.findOne({ phone, _id: { $ne: userId } });
    if (phoneExists) throw Object.assign(new Error('So dien thoai da duoc su dung'), { status: 409 });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name: input.name.trim(), email, ...(phone ? { phone } : {}) },
    { new: true, runValidators: true },
  );
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  if (phone) await claimGuestOrdersForUser(user, email, phone);
  await maybeIssueWelcomeVoucher(String(user._id));
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
  await maybeIssueWelcomeVoucher(userId);
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
  await maybeIssueWelcomeVoucher(userId);
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
  await maybeIssueWelcomeVoucher(userId);
  return user.addresses;
}

const EMAIL_RESET_OTP_TTL_MS = 5 * 60 * 1000;
const EMAIL_RESET_TOKEN_TTL_MS = 10 * 60 * 1000;
const EMAIL_RESET_MAX_ATTEMPTS = 5;
const EMAIL_RESET_RESEND_MS = 60 * 1000;

function hashEmailOtp(email: string, otp: string) {
  const secret = process.env.JWT_ACCESS_SECRET || 'development-only-secret';
  return hashToken(`${email}:${otp}:${secret}`);
}

// ---- Quen / dat lai mat khau qua email OTP ----
export async function requestPasswordReset(email: string) {
  assertMailConfigured();
  const normalizedEmail = normalizeEmail(email);
  const genericResult = {
    message: 'Neu email ton tai, ma xac minh se duoc gui trong it phut.',
    expiresIn: Math.floor(EMAIL_RESET_OTP_TTL_MS / 1000),
  };
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+passwordResetOtpHash +passwordResetOtpExpires +passwordResetOtpAttempts +passwordResetOtpLastSentAt',
  );
  if (!user) return genericResult;

  const lastSentAt = user.passwordResetOtpLastSentAt?.getTime() || 0;
  if (Date.now() - lastSentAt < EMAIL_RESET_RESEND_MS) return genericResult;

  const otp = crypto.randomInt(100000, 1000000).toString();
  const sent = await sendMail({
    to: normalizedEmail,
    subject: `${otp} - Ma xac minh dat lai mat khau`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#27231f">
        <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#806b3d">L'Essence Noire</p>
        <h1 style="font-size:28px;font-weight:500">Khôi phục mật khẩu</h1>
        <p>Mã xác minh của bạn là:</p>
        <p style="font-size:34px;letter-spacing:8px;font-weight:700;color:#806b3d">${otp}</p>
        <p>Mã có hiệu lực trong 5 phút. Không chia sẻ mã này với bất kỳ ai.</p>
        <p style="color:#777;font-size:12px">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
      </div>`,
    text: `Ma xac minh dat lai mat khau cua ban la ${otp}. Ma co hieu luc trong 5 phut.`,
  });
  if (!sent) throw Object.assign(new Error('Khong the gui email xac minh luc nay'), { status: 502 });

  user.set({
    passwordResetOtpHash: hashEmailOtp(normalizedEmail, otp),
    passwordResetOtpExpires: new Date(Date.now() + EMAIL_RESET_OTP_TTL_MS),
    passwordResetOtpAttempts: 0,
    passwordResetOtpLastSentAt: new Date(),
  });
  await user.save();
  return genericResult;
}

export async function verifyEmailPasswordResetOtp(email: string, otp: string) {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+passwordResetOtpHash +passwordResetOtpExpires +passwordResetOtpAttempts',
  );
  const invalidOtp = () => Object.assign(new Error('Ma xac minh khong dung hoac da het han'), { status: 400 });

  if (!user?.passwordResetOtpHash || !user.passwordResetOtpExpires) throw invalidOtp();
  if (user.passwordResetOtpExpires.getTime() <= Date.now()) {
    user.set({ passwordResetOtpHash: undefined, passwordResetOtpExpires: undefined, passwordResetOtpAttempts: undefined });
    await user.save();
    throw invalidOtp();
  }

  const attempts = Number(user.passwordResetOtpAttempts || 0);
  if (attempts >= EMAIL_RESET_MAX_ATTEMPTS) {
    user.set({ passwordResetOtpHash: undefined, passwordResetOtpExpires: undefined, passwordResetOtpAttempts: undefined });
    await user.save();
    throw invalidOtp();
  }

  const expected = Buffer.from(user.passwordResetOtpHash, 'hex');
  const received = Buffer.from(hashEmailOtp(normalizedEmail, otp), 'hex');
  const matches = expected.length === received.length && crypto.timingSafeEqual(expected, received);
  if (!matches) {
    user.passwordResetOtpAttempts = attempts + 1;
    await user.save();
    throw invalidOtp();
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.set({
    passwordResetToken: hashToken(resetToken),
    passwordResetExpires: new Date(Date.now() + EMAIL_RESET_TOKEN_TTL_MS),
    passwordResetOtpHash: undefined,
    passwordResetOtpExpires: undefined,
    passwordResetOtpAttempts: undefined,
    passwordResetOtpLastSentAt: undefined,
  });
  await user.save();
  return { resetToken, expiresIn: Math.floor(EMAIL_RESET_TOKEN_TTL_MS / 1000) };
}

const PHONE_RESET_OTP_TTL_MS = 5 * 60 * 1000;
const PHONE_RESET_TOKEN_TTL_MS = 10 * 60 * 1000;
const PHONE_RESET_MAX_ATTEMPTS = 5;
const PHONE_RESET_RESEND_MS = 60 * 1000;

function hashPhoneOtp(phone: string, otp: string) {
  const secret = process.env.JWT_ACCESS_SECRET || 'development-only-secret';
  return hashToken(`${phone}:${otp}:${secret}`);
}

export async function requestPhonePasswordReset(inputPhone: string) {
  assertSmsConfigured();
  const phone = normalizePhone(inputPhone);
  const genericResult = {
    message: 'Neu so dien thoai ton tai, ma xac minh se duoc gui trong it phut.',
    expiresIn: Math.floor(PHONE_RESET_OTP_TTL_MS / 1000),
  };

  const user = await User.findOne({ phone }).select(
    '+passwordResetOtpHash +passwordResetOtpExpires +passwordResetOtpAttempts +passwordResetOtpLastSentAt',
  );
  if (!user) return genericResult;

  const lastSentAt = user.passwordResetOtpLastSentAt?.getTime() || 0;
  if (Date.now() - lastSentAt < PHONE_RESET_RESEND_MS) return genericResult;

  const otp = crypto.randomInt(100000, 1000000).toString();
  await sendPasswordResetOtp(phone, otp);
  user.set({
    passwordResetOtpHash: hashPhoneOtp(phone, otp),
    passwordResetOtpExpires: new Date(Date.now() + PHONE_RESET_OTP_TTL_MS),
    passwordResetOtpAttempts: 0,
    passwordResetOtpLastSentAt: new Date(),
  });
  await user.save();
  return genericResult;
}

export async function verifyPhonePasswordResetOtp(inputPhone: string, otp: string) {
  const phone = normalizePhone(inputPhone);
  const user = await User.findOne({ phone }).select(
    '+passwordResetOtpHash +passwordResetOtpExpires +passwordResetOtpAttempts',
  );
  const invalidOtp = () => Object.assign(new Error('Ma xac minh khong dung hoac da het han'), { status: 400 });

  if (!user?.passwordResetOtpHash || !user.passwordResetOtpExpires) throw invalidOtp();
  if (user.passwordResetOtpExpires.getTime() <= Date.now()) {
    user.set({ passwordResetOtpHash: undefined, passwordResetOtpExpires: undefined, passwordResetOtpAttempts: undefined });
    await user.save();
    throw invalidOtp();
  }

  const attempts = Number(user.passwordResetOtpAttempts || 0);
  if (attempts >= PHONE_RESET_MAX_ATTEMPTS) {
    user.set({ passwordResetOtpHash: undefined, passwordResetOtpExpires: undefined, passwordResetOtpAttempts: undefined });
    await user.save();
    throw invalidOtp();
  }

  const expected = Buffer.from(user.passwordResetOtpHash, 'hex');
  const received = Buffer.from(hashPhoneOtp(phone, otp), 'hex');
  const matches = expected.length === received.length && crypto.timingSafeEqual(expected, received);
  if (!matches) {
    user.passwordResetOtpAttempts = attempts + 1;
    await user.save();
    throw invalidOtp();
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.set({
    passwordResetToken: hashToken(resetToken),
    passwordResetExpires: new Date(Date.now() + PHONE_RESET_TOKEN_TTL_MS),
    passwordResetOtpHash: undefined,
    passwordResetOtpExpires: undefined,
    passwordResetOtpAttempts: undefined,
    passwordResetOtpLastSentAt: undefined,
  });
  await user.save();
  return { resetToken, expiresIn: Math.floor(PHONE_RESET_TOKEN_TTL_MS / 1000) };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select('+password');
  if (!user) throw Object.assign(new Error('Token khong hop le hoac da het han'), { status: 400 });

  user.password = await bcrypt.hash(newPassword, 10);
  user.set({
    passwordResetToken: undefined,
    passwordResetExpires: undefined,
    passwordResetOtpHash: undefined,
    passwordResetOtpExpires: undefined,
    passwordResetOtpAttempts: undefined,
    passwordResetOtpLastSentAt: undefined,
    refreshToken: undefined,
  });
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
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, isEmailVerified: user.isEmailVerified },
  };
}
