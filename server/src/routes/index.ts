import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import reviewRoutes from './review.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import uploadRoutes from './upload.routes';

import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

export default router;