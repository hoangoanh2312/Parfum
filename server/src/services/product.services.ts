import { Product } from '../models/product.model';

export const getProducts = async () => {
  return Product.find()
    .populate('brand')
    .populate('category')
    .sort({ createdAt: -1 });
};

export const getProductById = async (id: string) => {
  return Product.findById(id)
    .populate('brand')
    .populate('category');
};

export const createProduct = async (data: any) => {
  return Product.create(data);
};

export const updateProduct = async (
  id: string,
  data: any,
) => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const updateProductStatus = async (
  id: string,
  isActive: boolean,
) => {
  return Product.findByIdAndUpdate(
    id,
    { isActive },
    { new: true },
  );
};