import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middlewares/auth.middleware';
import { validateParams } from '../middlewares/validate.middleware';
import * as ctrl from '../controllers/account.controller';

const router = Router();
const productParamsSchema = z.object({
  productId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/),
});

router.use(authenticate);
router.get('/orders', ctrl.getOrders);
router.get('/wishlist', ctrl.getWishlist);
router.post('/wishlist/:productId', validateParams(productParamsSchema), ctrl.addWishlistItem);
router.delete('/wishlist/:productId', validateParams(productParamsSchema), ctrl.removeWishlistItem);

export default router;
