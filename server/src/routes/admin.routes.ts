import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, authorize('admin'), getDashboard);

export default router;
