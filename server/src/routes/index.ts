import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();
router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
// TODO: router.use('/products', productRoutes) ... theo cac sprint
export default router;
