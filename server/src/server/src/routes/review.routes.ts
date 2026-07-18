import { Router } from 'express';
import { z } from 'zod';
import * as ctrl from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';

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

// Endpoint quan tri: BAT BUOC admin (truoc day bi thieu -> lo bao mat)
router.get('/admin', authenticate, authorize('admin'), ctrl.getAdminReviews);
router.patch('/admin/:reviewId/approve', authenticate, authorize('admin'), ctrl.approveReview);
router.patch('/admin/:reviewId/reject', authenticate, authorize('admin'), ctrl.rejectReview);

export default router;
