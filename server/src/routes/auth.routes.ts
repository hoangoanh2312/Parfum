import { Router } from 'express';
import { z } from 'zod';
import * as ctrl from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { rateLimit } from '../middlewares/rateLimit.middleware';

const r = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many auth attempts, please try again later',
});
const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');
const phoneSchema = z
  .string()
  .regex(/^0\d{9}$/, 'Phone must start with 0 and contain exactly 10 digits');
const addressSchema = z.object({
  label: z.string().trim().min(1).max(50),
  phone: phoneSchema,
  detail: z.string().trim().min(1).max(250),
});
const emailSchema = z.string().trim().toLowerCase().email();

r.post(
  '/register',
  authLimiter,
  validate(z.object({
    name: z.string().trim().min(2).max(80),
    email: emailSchema,
    password: strongPasswordSchema,
  })),
  ctrl.register,
);
r.post(
  '/login',
  authLimiter,
  validate(z.object({ email: emailSchema, password: z.string().min(1).max(128) })),
  ctrl.login,
);
r.post('/refresh', authLimiter, validate(z.object({ refreshToken: z.string().min(20) })), ctrl.refresh);
r.post('/logout', authenticate, ctrl.logout);
r.get('/me', authenticate, ctrl.me);
r.put(
  '/me',
  authenticate,
  validate(z.object({ name: z.string().trim().min(2).max(80), email: emailSchema })),
  ctrl.updateProfile,
);
r.put(
  '/me/password',
  authenticate,
  validate(z.object({ currentPassword: z.string().min(1).max(128), newPassword: strongPasswordSchema })),
  ctrl.changePassword,
);
r.post(
  '/me/addresses',
  authenticate,
  validate(addressSchema),
  ctrl.addAddress,
);
r.put(
  '/me/addresses/:addressId',
  authenticate,
  validate(addressSchema),
  ctrl.updateAddress,
);
r.patch('/me/addresses/:addressId/default', authenticate, ctrl.setDefaultAddress);
r.delete('/me/addresses/:addressId', authenticate, ctrl.deleteAddress);
export default r;
