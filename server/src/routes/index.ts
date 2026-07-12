import { Router } from 'express';
import authRoutes from './auth.routes';
import wishlistRoutes from './wishlist.routes';

const router = Router();
router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/wishlist', wishlistRoutes);
// TODO: router.use('/products', productRoutes) ... theo cac sprint
export default router;
