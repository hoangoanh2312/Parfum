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

// POST /api/orders  { method?, address?, note? }
// Tạo đơn hàng THẬT: kiểm tra tồn kho -> trừ kho -> tạo Order + Payment -> xóa giỏ
export const createOrder = async (req: Request, res: Response) => {
  try {
    const data = await orderService.createOrder(uid(req), req.body || {});
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message, problems: error.problems });
  }
};

// GET /api/orders  -> DANH SÁCH đơn của user đang đăng nhập (PF-35)
export const myOrders = async (req: Request, res: Response) => {
  try {
    const data = await orderService.getMyOrders(uid(req));
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id  -> CHI TIẾT 1 đơn của user (PF-35)
export const orderDetail = async (req: Request, res: Response) => {
  try {
    const data = await orderService.getOrderById(uid(req), req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
