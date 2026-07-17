import { Router } from 'express';
import authRoutes from './auth.routes';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { rateLimit } from '../middlewares/rateLimit.middleware';

import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';
import productRoutes from './product.routes';

const router = Router();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Too many API requests, please try again later',
});

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use(apiLimiter);
router.use('/auth', authRoutes);

router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);

router.get('/admin-only', authenticate, authorize('admin'), (_req, res) => res.json({ message: 'Admin only' }));

export default router;
