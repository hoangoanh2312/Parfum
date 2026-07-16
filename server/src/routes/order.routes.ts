import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
<<<<<<< Updated upstream
import { checkoutPreview, checkStock, createOrder } from '../controllers/order.controller';
=======
import {
  checkoutPreview,
  checkStock,
  createOrder,
  myOrders,
  orderDetail,
  paymentInfo,
} from '../controllers/order.controller';
>>>>>>> Stashed changes

const router = Router();

router.get('/checkout-preview', authenticate, checkoutPreview);
// Không bắt buộc đăng nhập: chỉ đọc tồn kho theo danh sách item gửi lên
// -> khách vãng lai cũng kiểm tra được giỏ hàng
router.post('/check-stock', checkStock);
// Tạo đơn hàng thật: kiểm tra tồn kho -> trừ kho -> tạo Order + Payment -> xóa giỏ
router.post('/', authenticate, createOrder);
<<<<<<< Updated upstream
=======
// PF-36: thông tin thanh toán + QR chuyển khoản (đặt TRƯỚC /:id)
router.get('/:id/payment', authenticate, paymentInfo);
// PF-35: chi tiết 1 đơn (đặt CUỐI cùng để không nuốt /checkout-preview, /check-stock)
router.get('/:id', authenticate, orderDetail);
>>>>>>> Stashed changes

export default router;
