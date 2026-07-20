import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as wishlistController from '../controllers/wishlist.controller';

const router = Router();

router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
