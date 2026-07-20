import { Router } from 'express';
import { z } from 'zod';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  checkoutPreview,
  checkStock,
  createOrder,
  cancelOrder,
  myOrders,
  orderDetail,
  paymentInfo,
} from '../controllers/order.controller';

const router = Router();

// Dia chi giao hang BAT BUOC co line + phone; cac truong khac tuy chon.
const orderAddressSchema = z.object({
  fullName: z.string().trim().min(1).optional(),
  phone: z.string().trim().regex(/^0\d{9}$/, 'So dien thoai khong hop le'),
  line: z.string().trim().min(1, 'Thieu dia chi giao hang'),
  ward: z.string().trim().optional(),
  district: z.string().trim().optional(),
  province: z.string().trim().optional(),
  city: z.string().trim().optional(),
});

const createOrderSchema = z.object({
  method: z.enum(['cod', 'bank_qr']).optional(),
  address: orderAddressSchema,
  note: z.string().trim().max(500).optional(),
  items: z
    .array(z.object({ variant: z.string().trim().min(1), quantity: z.number().int().positive() }))
    .optional(),
  voucherCode: z.string().trim().min(1).optional(),
});

router.get('/checkout-preview', authenticate, checkoutPreview);
router.post('/check-stock', checkStock);

router.get('/', authenticate, myOrders);
// Tao don: validate dia chi bat buoc; cho phep khach vang lai (optionalAuthenticate)
router.post('/', optionalAuthenticate, validate(createOrderSchema), createOrder);
// Huy don + hoan kho (chi user so huu, phai dang nhap)
router.post('/:id/cancel', authenticate, cancelOrder);
router.get('/:id/payment', optionalAuthenticate, paymentInfo);
router.get('/:id', optionalAuthenticate, orderDetail);

export default router;
