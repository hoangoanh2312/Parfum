import { Router } from 'express';
import authRoutes from './auth.routes';
import { authenticate, authorize } from '../middlewares/auth.middleware';

import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);

router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

router.get('/admin-only', authenticate, authorize('admin'), (_req, res) => res.json({ message: 'Admin only' }));
// TODO: router.use('/products', productRoutes) ... theo cac sprint

export default router;