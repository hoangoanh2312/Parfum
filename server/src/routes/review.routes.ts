import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware';
import { createReview, listProductReviews } from '../controllers/review.controller';

const router = Router();

const createReviewSchema = z.object({
  product: z.string().trim().regex(/^[0-9a-fA-F]{24}$/),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  comment: z.string().trim().min(3).max(1000),
  images: z.array(z.string().trim().url()).max(5).optional(),
  guestName: z.string().trim().min(2).max(80).optional(),
  guestEmail: z.string().trim().toLowerCase().email().optional(),
});

router.get('/product/:productId', listProductReviews);
router.post('/', validate(createReviewSchema), createReview);

export default router;
