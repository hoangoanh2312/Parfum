import { Router } from 'express';
import { z } from 'zod';
import * as ctrl from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  guestName: z.string().min(1).max(80),
  guestEmail: z.string().email(),
  comment: z.string().min(1).max(1000),
  images: z.array(z.string().url()).max(5).optional().default([]),
});

router.get('/products/:idOrSlug', ctrl.getProductReviews);
router.post('/products/:idOrSlug', validate(reviewSchema), ctrl.createProductReview);

router.get('/admin', ctrl.getAdminReviews);
router.patch('/admin/:reviewId/approve', ctrl.approveReview);
router.patch('/admin/:reviewId/reject', ctrl.rejectReview);

export default router;
