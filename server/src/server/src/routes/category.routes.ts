import express from 'express';
import * as controller from '../controllers/category.controller';

const router = express.Router();

router.get('/', controller.getCategories);

export default router;
