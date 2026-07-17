import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import reviewRoutes from './review.routes';

const router = Router();
router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
export default router;
