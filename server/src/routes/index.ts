import { Router } from 'express';

import authRoutes from './auth.routes';
import uploadRoutes from './upload.routes';
import variantRoutes from './variant.routes';
import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';
import productRoutes from './product.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/variants', variantRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes);

export default router;
