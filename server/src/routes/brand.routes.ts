import { Router } from 'express';
import { Brand } from '../models/brand.model';

const router = Router();

router.get('/', async (_, res) => {
  const brands = await Brand.find().sort({ name: 1 });

  res.json({
    success: true,
    data: brands,
  });
});

export default router;