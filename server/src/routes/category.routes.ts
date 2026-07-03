import { Router } from 'express';
import { Category } from '../models/category.model';

const router = Router();

router.get('/', async (_, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.json({
    success: true,
    data: categories,
  });
});

export default router;