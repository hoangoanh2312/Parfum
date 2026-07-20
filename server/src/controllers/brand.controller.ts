import { Request, Response, NextFunction } from 'express';
import { getBrands } from '../services/brand.services';

export const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await getBrands();

    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};