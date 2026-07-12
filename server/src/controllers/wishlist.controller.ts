import { Request, Response, NextFunction } from 'express';
import * as wishlistService from '../services/wishlist.service';

export async function getWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const wishlist = await wishlistService.getByUser(userId);
    const products = (wishlist as any)?.products ?? [];
    res.json({ success: true, data: { products } });
  } catch (e) {
    next(e);
  }
}

export async function addToWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { productId } = req.params;
    const wishlist = await wishlistService.addProduct(userId, productId);
    const products = (wishlist as any)?.products ?? [];
    res.status(200).json({
      success: true,
      message: 'Đã thêm sản phẩm vào danh sách yêu thích',
      data: { products },
    });
  } catch (e) {
    next(e);
  }
}

export async function removeFromWishlist(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { productId } = req.params;
    const wishlist = await wishlistService.removeProduct(userId, productId);
    const products = (wishlist as any)?.products ?? [];
    res.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
      data: { products },
    });
  } catch (e) {
    next(e);
  }
}
