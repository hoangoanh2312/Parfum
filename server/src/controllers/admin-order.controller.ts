import { NextFunction, Request, Response } from 'express';
import * as adminOrderService from '../services/admin-order.service';

export async function listOrders(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ success: true, data: await adminOrderService.listOrders(req.query) });
  } catch (error) { next(error); }
}

export async function getOrderDetail(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ success: true, data: await adminOrderService.getOrderDetail(req.params.orderId) });
  } catch (error) { next(error); }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminOrderService.updateOrderStatus(req.params.orderId, req.body?.status);
    res.status(200).json({ success: true, message: 'Đã cập nhật trạng thái đơn hàng', data });
  } catch (error) { next(error); }
}

export async function confirmPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminOrderService.confirmPayment(req.params.orderId);
    res.status(200).json({ success: true, message: 'Đã xác nhận thanh toán đơn hàng', data });
  } catch (error) { next(error); }
}
