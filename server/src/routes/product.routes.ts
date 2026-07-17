import { Router } from 'express';
import { getProducts, getProductDetail } from '../controllers/product.controller';

const router = Router();

router.get('/', getProducts);            // danh sách sản phẩm
router.get('/:idOrSlug', getProductDetail); // chi tiết theo id hoặc slug

export default router;
