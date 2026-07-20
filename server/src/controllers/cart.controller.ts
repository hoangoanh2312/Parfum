import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';

// Lấy userId từ token (auth.middleware gắn vào req.user = { id, role })
const uid = (req: Request) => (req as any).user.id;

export const getMyCart = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true, data: await cartService.getCart(uid(req)) });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { variant, quantity } = req.body;
    if (!variant) {
      return res.status(400).json({ success: false, message: 'Thiếu variant' });
    }
    const data = await cartService.addItem(uid(req), variant, quantity);
    res.status(200).json({ success: true, message: 'Đã thêm vào giỏ', data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const data = await cartService.updateItem(uid(req), req.params.variantId, req.body.quantity);
    res.status(200).json({ success: true, message: 'Đã cập nhật giỏ', data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const data = await cartService.removeItem(uid(req), req.params.variantId);
    res.status(200).json({ success: true, message: 'Đã xóa sản phẩm', data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export const clearMyCart = async (req: Request, res: Response) => {
  try {
    const data = await cartService.clearCart(uid(req));
    res.status(200).json({ success: true, message: 'Đã xóa toàn bộ giỏ', data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export const mergeMyCart = async (req: Request, res: Response) => {
  try {
    const data = await cartService.mergeCart(uid(req), req.body.items);
    res.status(200).json({ success: true, message: 'Đã đồng bộ giỏ hàng', data });
  } catch (error: any) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
