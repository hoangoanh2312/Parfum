import { Request, Response } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
} from '../services/product.services';

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await getProducts();

  res.json({
    success: true,
    data: products,
  });
};

export const getOneProduct = async (req: Request, res: Response) => {
  const product = await getProductById(req.params.id);

  res.json({
    success: true,
    data: product,
  });
};

export const createNewProduct = async (
  req: Request,
  res: Response,
) => {
  try {

    const files = req.files as Express.Multer.File[];

    const images =
      files?.map((file) => file.path) ?? [];

    const product = await createProduct({
      ...req.body,
      images,
    });

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error,
    });

  }
};

export const updateOneProduct = async (
  req: Request,
  res: Response,
) => {
  try {
    const files = req.files as Express.Multer.File[];

    const images =
      files?.map((file) => file.path) ?? [];

    const data: any = {
      ...req.body,
    };

    if (images.length > 0) {
      data.images = images;
    }

    const product = await updateProduct(
      req.params.id,
      data,
    );

    res.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error,
    });
  }
};

export const toggleProductStatus = async (
  req: Request,
  res: Response,
) => {
  const product = await updateProductStatus(
    req.params.id,
    req.body.isActive,
  );

  res.json({
    success: true,
    data: product,
  });
};