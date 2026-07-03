import { Router } from 'express';

import authRoutes from './auth.routes';
import uploadRoutes from './upload.routes';
import variantRoutes from './variant.routes';
import productRoutes from './product.routes';
import brandRoutes from './brand.routes';
import categoryRoutes from './category.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/variants', variantRoutes);
router.use('/products', productRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);

export default router;