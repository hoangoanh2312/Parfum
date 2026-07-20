import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';

type ProductRecord = {
  _id: unknown;
  name: string;
  slug: string;
  description?: string;
  brand?: { _id: unknown; name: string } | null;
  category?: { _id: unknown; name: string } | null;
  images?: string[];
  fragranceFamily?: string;
  concentration?: string;
  gender?: string;
  season?: string[];
};

type VariantRecord = {
  product: unknown;
  size?: string;
  volume?: string;
  price: number;
  images?: string[];
};

export const getProducts = async () => {
  const products = await Product.find({ isActive: true })
    .populate('brand', 'name')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean<ProductRecord[]>();

  const productIds = products.map((product) => product._id);
  const variants = await Variant.find({ product: { $in: productIds } })
    .select('product size volume price images')
    .lean<VariantRecord[]>();

  const variantsByProduct = new Map<string, VariantRecord[]>();

  for (const variant of variants) {
    const productId = String(variant.product);
    const productVariants = variantsByProduct.get(productId) ?? [];
    productVariants.push(variant);
    variantsByProduct.set(productId, productVariants);
  }

  return products.map((product) => {
    const productVariants = variantsByProduct.get(String(product._id)) ?? [];
    const prices = productVariants.map((variant) => variant.price);
    const sizes = Array.from(
      new Set(
        productVariants
          .map((variant) => variant.size ?? variant.volume)
          .filter((size): size is string => Boolean(size)),
      ),
    );
    const firstVariantImage = productVariants.find((variant) => variant.images?.length)?.images?.[0];

    return {
      ...product,
      price: prices.length ? Math.min(...prices) : 0,
      sizes,
      images: product.images?.length ? product.images : firstVariantImage ? [firstVariantImage] : [],
    };
  });
};
