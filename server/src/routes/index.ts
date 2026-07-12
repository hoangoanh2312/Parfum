import { Router } from 'express';

import authRoutes from './auth.routes';
import uploadRoutes from './upload.routes';
import variantRoutes from './variant.routes';
import adminRoutes from './admin.routes';

import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/variants', variantRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

// TODO: router.use('/products', productRoutes) ... theo cac sprint

export default router;