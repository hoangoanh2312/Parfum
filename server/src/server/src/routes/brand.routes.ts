import express from 'express';
import * as controller from '../controllers/brand.controller';

const router = express.Router();

router.get('/', controller.getBrands);

export default router;
