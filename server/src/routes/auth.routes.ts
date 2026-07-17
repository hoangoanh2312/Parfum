import { Router } from 'express';
import { z } from 'zod';
import * as ctrl from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const r = Router();
const phoneSchema = z
  .string()
  .regex(/^0\d{9}$/, 'Phone must start with 0 and contain exactly 10 digits');
const addressSchema = z.object({
  label: z.string().min(1),
  phone: phoneSchema,
  detail: z.string().min(1),
});

r.post('/register', validate(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) })), ctrl.register);
r.post('/login', validate(z.object({ email: z.string().email(), password: z.string() })), ctrl.login);
r.post('/refresh', validate(z.object({ refreshToken: z.string() })), ctrl.refresh);
r.post('/logout', authenticate, ctrl.logout);
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
r.delete('/me/addresses/:addressId', authenticate, ctrl.deleteAddress);
export default r;
