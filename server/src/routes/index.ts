import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import reviewRoutes from './review.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;
