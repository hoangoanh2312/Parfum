import { Request, Response } from 'express';
import * as productService from '../services/product.service';

<<<<<<< HEAD
// GET /api/products  -> danh sách sản phẩm cho web, có filter/sort/pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const data = await productService.getProducts(req.query);
=======
// GET /api/products  -> mảng thẻ sản phẩm cho web
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const data = await productService.getProducts();
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

// GET /api/products/:idOrSlug -> chi tiết + variants
export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const data = await productService.getProductDetail(req.params.idOrSlug);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};
