import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

const uid = (req: Request) => (req as any).user?.id;

// GET /api/orders/checkout-preview
export const checkoutPreview = async (req: Request, res: Response) => {
  try {
    const data = await orderService.prepareCheckout(uid(req));
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// POST /api/orders/check-stock
export const checkStock = async (req: Request, res: Response) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const data = await orderService.checkStock(items);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// POST /api/orders
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

// POST /api/orders/:id/cancel
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const data = await orderService.cancelOrder(uid(req), req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// GET /api/orders
export const myOrders = async (req: Request, res: Response) => {
  try {
    const data = await orderService.getMyOrders(uid(req));
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
export const orderDetail = async (req: Request, res: Response) => {
  try {
    const data = await orderService.getOrderById(uid(req), req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id/payment
export const paymentInfo = async (req: Request, res: Response) => {
  try {
    const data = await orderService.getPaymentInfo(uid(req), req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
