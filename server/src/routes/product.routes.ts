import { Router } from 'express';
import { z } from 'zod';
import { getProducts, getProductDetail } from '../controllers/product.controller';
import { validateParams, validateQuery } from '../middlewares/validate.middleware';

const router = Router();
const csvSchema = z
  .union([z.string().trim().max(300), z.array(z.string().trim().max(80))])
  .optional();
const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().max(100).optional(),
  brand: csvSchema,
  category: csvSchema,
  gender: csvSchema,
  scent: csvSchema,
  fragranceFamily: csvSchema,
  concentration: csvSchema,
  season: csvSchema,
  occasion: csvSchema,
  size: csvSchema,
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'priceAsc', 'priceDesc', 'name_asc', 'name_desc']).optional(),
});
const productParamsSchema = z.object({
  idOrSlug: z.string().trim().min(1).max(120).regex(/^[a-zA-Z0-9-_]+$/),
});

router.get('/', validateQuery(productQuerySchema), getProducts);
router.get('/:idOrSlug', validateParams(productParamsSchema), getProductDetail);

export default router;
