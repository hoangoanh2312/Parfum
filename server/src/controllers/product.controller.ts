import { Request, Response } from 'express';
import * as productService from '../services/product.services';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const data = await productService.getProducts();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};
