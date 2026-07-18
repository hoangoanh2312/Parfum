import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { rateLimit } from '../middlewares/rateLimit.middleware';

import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';
import productRoutes from './product.routes';
import variantRoutes from './variant.routes';
import reviewRoutes from './review.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import accountRoutes from './account.routes';
import uploadRoutes from './upload.routes';
import adminRoutes from './admin.routes';

const router = Router();

// pf52: gioi han so request de chong spam / brute-force
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
router.use('/variants', variantRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/account', accountRoutes);
router.use('/', uploadRoutes);

// Khu vuc quan tri: toan bo nghiep vu admin (da tu chan authenticate + admin)
router.use('/admin', adminRoutes);

router.get('/admin-only', authenticate, authorize('admin'), (_req, res) =>
  res.json({ message: 'Admin only' }),
);

export default router;
