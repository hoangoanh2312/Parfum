import { Router } from 'express';
import { z } from 'zod';
import * as ctrl from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const r = Router();
r.post('/register', validate(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) })), ctrl.register);
r.post('/login', validate(z.object({ email: z.string().email(), password: z.string() })), ctrl.login);
r.post('/refresh', validate(z.object({ refreshToken: z.string() })), ctrl.refresh);
r.post('/logout', authenticate, ctrl.logout);
r.get('/me', authenticate, ctrl.me);
export default r;
