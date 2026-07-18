// =============================================================================
//  ADMIN ROUTES  ->  mount tai /api/admin
//  TAT CA route deu yeu cau: authenticate + authorize('admin').
//  Gom toan bo nghiep vu quan tri vao 1 khu vuc rieng, tach khoi API public.
// =============================================================================
import { Router } from 'express';
import { z } from 'zod';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { upload } from '../middlewares/upload.middleware';
import { uploadImage, uploadImages } from '../controllers/upload.controller';
import * as ctrl from '../controllers/admin.controller';
import * as media from '../controllers/media.controller';

const r = Router();

// Chan cong: chi admin da dang nhap moi vao duoc moi route ben duoi
r.use(authenticate, authorize('admin'));

// ------------------------------------------------------------------ schemas --
const notesSchema = z
  .object({
    top: z.array(z.string()).optional(),
    middle: z.array(z.string()).optional(),
    base: z.array(z.string()).optional(),
  })
  .optional();

const productCreateSchema = z.object({
  name: z.string().min(1, 'Ten san pham la bat buoc'),
  slug: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  gender: z.string().optional(),
  fragranceFamily: z.string().optional(),
  concentration: z.string().optional(),
  season: z.array(z.string()).optional(),
  notes: notesSchema,
  isActive: z.boolean().optional(),
});
const productUpdateSchema = productCreateSchema.partial();

const variantCreateSchema = z.object({
  product: z.string().min(1),
  sku: z.string().min(1),
  volume: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
const variantUpdateSchema = variantCreateSchema.partial();

const nameSchema = z.object({ name: z.string().min(1) });
const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipping', 'done', 'cancelled']),
});
const paymentStatusSchema = z.object({ status: z.enum(['unpaid', 'paid']) });
const roleSchema = z.object({ role: z.enum(['admin', 'customer']) });

// ------------------------------------------------------------------- routes --
// Dashboard
r.get('/stats', ctrl.getStats);

// Products
r.get('/products', ctrl.listProducts);
r.get('/products/:id', ctrl.getProduct);
r.post('/products', validate(productCreateSchema), ctrl.createProduct);
r.put('/products/:id', validate(productUpdateSchema), ctrl.updateProduct);
r.delete('/products/:id', ctrl.deleteProduct);

// Variants
r.get('/variants', ctrl.listVariants);
r.post('/variants', validate(variantCreateSchema), ctrl.createVariant);
r.put('/variants/:id', validate(variantUpdateSchema), ctrl.updateVariant);
r.delete('/variants/:id', ctrl.deleteVariant);

// Brands
r.get('/brands', ctrl.listBrands);
r.post('/brands', validate(nameSchema), ctrl.createBrand);
r.put('/brands/:id', validate(nameSchema), ctrl.updateBrand);
r.delete('/brands/:id', ctrl.deleteBrand);

// Categories
r.get('/categories', ctrl.listCategories);
r.post('/categories', validate(nameSchema), ctrl.createCategory);
r.put('/categories/:id', validate(nameSchema), ctrl.updateCategory);
r.delete('/categories/:id', ctrl.deleteCategory);

// Orders
r.get('/orders', ctrl.listOrders);
r.get('/orders/:id', ctrl.getOrder);
r.patch('/orders/:id/status', validate(orderStatusSchema), ctrl.updateOrderStatus);
r.patch('/orders/:id/payment', validate(paymentStatusSchema), ctrl.updatePaymentStatus);

// Users
r.get('/users', ctrl.listUsers);
r.patch('/users/:id/role', validate(roleSchema), ctrl.updateUserRole);
r.delete('/users/:id', ctrl.deleteUser);

// Reviews
r.get('/reviews', ctrl.listReviews);
r.patch('/reviews/:id/approve', ctrl.approveReview);
r.patch('/reviews/:id/reject', ctrl.rejectReview);
r.delete('/reviews/:id', ctrl.deleteReview);

// Upload anh (tra ve URL de dinh kem san pham / bien the)
r.post('/upload', upload.single('image'), uploadImage);

// Media / Cloudinary — quan ly anh toan he thong
r.get('/media/status', media.status);
r.get('/media', media.list);
r.post('/media/upload', upload.array('images', 10), uploadImages);
r.post('/media/delete', media.remove);


export default r;
