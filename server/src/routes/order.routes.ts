import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { checkoutPreview, checkStock, createOrder } from '../controllers/order.controller';

const router = Router();

router.get('/checkout-preview', authenticate, checkoutPreview);
// Không bắt buộc đăng nhập: chỉ đọc tồn kho theo danh sách item gửi lên
// -> khách vãng lai cũng kiểm tra được giỏ hàng
router.post('/check-stock', checkStock);
// Tạo đơn hàng thật: kiểm tra tồn kho -> trừ kho -> tạo Order + Payment -> xóa giỏ
router.post('/', authenticate, createOrder);

export default router;
