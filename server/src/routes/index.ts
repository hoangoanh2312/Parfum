import { Router } from 'express';

import authRoutes from './auth.routes';
import uploadRoutes from './upload.routes';
import variantRoutes from './variant.routes';

import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';
import productRoutes from './product.routes';

import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import adminOrderRoutes from './admin-order.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/variants', variantRoutes);

router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/products', productRoutes); // danh sách/chi tiết sản phẩm cho web

router.use('/cart', cartRoutes);   // PF-27 Giỏ hàng
router.use('/orders', orderRoutes); // PF-29 Chuẩn bị checkout / kiểm tồn kho
router.use('/admin/orders', adminOrderRoutes); // PF-30 Admin quản lý đơn hàng

export default router;
