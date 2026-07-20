import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { confirmPayment, getOrderDetail, listOrders, updateOrderStatus } from '../controllers/admin-order.controller';

const router = Router();
router.use(authenticate, authorize('admin'));
router.get('/', listOrders);
router.get('/:orderId', getOrderDetail);
router.patch('/:orderId/status', updateOrderStatus);
router.patch('/:orderId/confirm-payment', confirmPayment);

export default router;
