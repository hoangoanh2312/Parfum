import { Router } from 'express';

import authRoutes from './auth.routes';
import uploadRoutes from './upload.routes';
import variantRoutes from './variant.routes';

import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';

const router = Router();

<<<<<<< HEAD
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/variants', variantRoutes);
=======
router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);

router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

// TODO: router.use('/products', productRoutes) ... theo cac sprint
>>>>>>> master

export default router;