import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import {
  getAllProducts,
  getOneProduct,
  createNewProduct,
  updateOneProduct,
  toggleProductStatus,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getOneProduct);
router.post(
  '/',
  upload.array('images'),
  createNewProduct,
);
router.put(
  '/:id',
  upload.array('images'),
  updateOneProduct,
);
router.patch('/:id/status', toggleProductStatus);

export default router;