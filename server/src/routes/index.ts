import { Router } from 'express';
import authRoutes from './auth.routes';
<<<<<<< HEAD
import productRoutes from './product.routes';
import reviewRoutes from './review.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import uploadRoutes from './upload.routes';
=======

import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';
>>>>>>> feature/pf-32-category-brand-crud

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
<<<<<<< HEAD
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
=======

router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);

// TODO: router.use('/products', productRoutes) ... theo cac sprint
>>>>>>> feature/pf-32-category-brand-crud

export default router;