import { Request, Response } from 'express';
import * as brandService from '../services/brand.services';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const data = await brandService.getBrands();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};
