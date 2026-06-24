import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { uploadImage } from '../controllers/upload.controller';

const router = Router();

// Route này nhận file với key là 'image'
router.post('/upload', upload.single('image'), uploadImage);

export default router;