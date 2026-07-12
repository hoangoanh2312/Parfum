import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { checkoutPreview, checkStock } from '../controllers/order.controller';

const router = Router();

router.get('/checkout-preview', authenticate, checkoutPreview);
router.post('/check-stock', authenticate, checkStock);

export default router;
