import { Router } from 'express';

import authRoutes from './auth.routes';
import uploadRoutes from './upload.routes';
import variantRoutes from './variant.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/variants', variantRoutes);

export default router;