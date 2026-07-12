import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

const uid = (req: Request) => (req as any).user.id;

// GET /api/orders/checkout-preview
// Chuẩn bị checkout: kiểm tra tồn kho giỏ hàng + tính tổng (chưa tạo đơn)
export const checkoutPreview = async (req: Request, res: Response) => {
  try {
    const data = await orderService.prepareCheckout(uid(req));
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// POST /api/orders/check-stock  { items: [{ variant, quantity }] }
// Kiểm tra tồn kho cho danh sách item bất kỳ
export const checkStock = async (req: Request, res: Response) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const data = await orderService.checkStock(items);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
