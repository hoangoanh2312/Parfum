import { Router } from 'express';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import {
  checkoutPreview,
  checkStock,
  createOrder,
  myOrders,
  orderDetail,
  paymentInfo,
} from '../controllers/order.controller';

const router = Router();

router.get('/checkout-preview', authenticate, checkoutPreview);
// Không bắt buộc đăng nhập: chỉ đọc tồn kho theo danh sách item gửi lên
// -> khách vãng lai cũng kiểm tra được giỏ hàng
router.post('/check-stock', checkStock);

// PF-35: danh sách đơn của khách đang đăng nhập
router.get('/', authenticate, myOrders);
// Tạo đơn hàng thật: kiểm tra tồn kho -> trừ kho -> tạo Order + Payment -> xóa giỏ
router.post('/', optionalAuthenticate, createOrder);
// PF-36: thông tin thanh toán + QR chuyển khoản (đặt TRƯỚC /:id)
router.get('/:id/payment', optionalAuthenticate, paymentInfo);
// PF-35: chi tiết 1 đơn (đặt CUỐI cùng để không nuốt /checkout-preview, /check-stock)
router.get('/:id', optionalAuthenticate, orderDetail);

export default router;
