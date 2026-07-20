import { Router } from 'express';
import { z } from 'zod';
import * as ctrl from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { rateLimit } from '../middlewares/rateLimit.middleware';

const r = Router();

// Limiter chat rieng cho cac endpoint nhay cam -> chong brute-force login/register/quen mat khau.
// Luu y: rateLimit dang in-memory theo tien trinh; khi deploy nhieu instance nen dung Redis store.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Qua nhieu lan thu, vui long thu lai sau 15 phut',
});

const phoneSchema = z
  .string()
  .regex(/^0\d{9}$/, 'Phone must start with 0 and contain exactly 10 digits');

// Shape dia chi thong nhat. Chap nhan `detail` (client cu) va map sang `line` o service.
const addressSchema = z
  .object({
    label: z.string().trim().min(1).optional(),
    fullName: z.string().trim().min(1).optional(),
    phone: phoneSchema,
    line: z.string().trim().min(1).optional(),
    detail: z.string().trim().min(1).optional(),
    ward: z.string().trim().optional(),
    district: z.string().trim().optional(),
    province: z.string().trim().optional(),
    isDefault: z.boolean().optional(),
  })
  .refine((d) => !!(d.line || d.detail), {
    message: 'Thieu dia chi chi tiet (line)',
    path: ['line'],
  });

r.post(
  '/register',
  authLimiter,
  validate(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) })),
  ctrl.register,
);
r.post(
  '/login',
  authLimiter,
  validate(z.object({ email: z.string().email(), password: z.string() })),
  ctrl.login,
);
r.post('/refresh', ctrl.refresh);
r.post('/logout', authenticate, ctrl.logout);

// Quen / dat lai mat khau qua email
r.post('/forgot-password', authLimiter, validate(z.object({ email: z.string().email() })), ctrl.forgotPassword);
r.post('/reset-password', authLimiter, validate(z.object({ token: z.string().min(10), password: z.string().min(6) })), ctrl.resetPassword);

// Xac thuc email
r.post('/verify-email', validate(z.object({ token: z.string().min(10) })), ctrl.verifyEmail);
r.post('/me/send-verification', authenticate, ctrl.sendVerification);

r.get('/me', authenticate, ctrl.me);
r.put(
  '/me',
  authenticate,
  validate(z.object({ name: z.string().min(1), email: z.string().email() })),
  ctrl.updateProfile,
);
r.put(
  '/me/password',
  authenticate,
  validate(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(6) })),
  ctrl.changePassword,
);
r.post('/me/addresses', authenticate, validate(addressSchema), ctrl.addAddress);
r.put('/me/addresses/:addressId', authenticate, validate(addressSchema), ctrl.updateAddress);
r.patch('/me/addresses/:addressId/default', authenticate, ctrl.setDefaultAddress);
r.delete('/me/addresses/:addressId', authenticate, ctrl.deleteAddress);
export default r;
