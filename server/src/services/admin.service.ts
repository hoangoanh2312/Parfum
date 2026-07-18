// =============================================================================
//  ADMIN SERVICE
//  Toan bo nghiep vu quan tri: thong ke, san pham, bien the, thuong hieu,
//  danh muc, don hang, nguoi dung, danh gia.
//  Chi duoc goi tu cac route da qua authenticate + authorize('admin').
// =============================================================================
import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';
import Brand from '../models/brand.model';
import Category from '../models/category.model';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { User } from '../models/user.model';
import { Review } from '../models/review.model';
import { restoreStock } from './order.service';

// ------------------------------------------------------------------ helpers --
const ORDER_STATUSES = ['pending', 'paid', 'shipping', 'done', 'cancelled'] as const;
const PAYMENT_STATUSES = ['unpaid', 'paid'] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

function httpError(message: string, status = 400) {
  return Object.assign(new Error(message), { status });
}

function toInt(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

function slugify(input: string) {
  return String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uniqueSlug(name: string, ignoreId?: string) {
  const base = slugify(name) || 'san-pham';
  let slug = base;
  let i = 1;
  // Tim slug chua duoc dung (bo qua chinh no khi update)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existed: any = await Product.findOne({ slug }).select('_id').lean();
    if (!existed || (ignoreId && String(existed._id) === String(ignoreId))) break;
    slug = `${base}-${i++}`;
  }
  return slug;
}

function paginate(page?: unknown, limit?: unknown) {
  const p = Math.max(1, toInt(page, 1));
  const l = Math.min(100, Math.max(1, toInt(limit, 20)));
  return { page: p, limit: l, skip: (p - 1) * l };
}

// =============================================================== DASHBOARD ===
export async function getStats() {
  const [
    productCount,
    activeProductCount,
    variantCount,
    brandCount,
    categoryCount,
    userCount,
    adminCount,
    orderCount,
    pendingReviews,
  ] = await Promise.all([
    Product.countDocuments({}),
    Product.countDocuments({ isActive: true }),
    Variant.countDocuments({}),
    Brand.countDocuments({}),
    Category.countDocuments({}),
    User.countDocuments({}),
    User.countDocuments({ role: 'admin' }),
    Order.countDocuments({}),
    Review.countDocuments({ approved: false }),
  ]);

  // Doanh thu = tong cac don da thanh toan / hoan tat (khong tinh don huy)
  const revenueAgg: any[] = await Order.aggregate([
    { $match: { status: { $in: ['paid', 'shipping', 'done'] } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const revenue = revenueAgg[0]?.total || 0;

  // Thong ke don theo trang thai
  const byStatusAgg: any[] = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const ordersByStatus: Record<string, number> = {};
  for (const status of ORDER_STATUSES) ordersByStatus[status] = 0;
  for (const row of byStatusAgg) ordersByStatus[row._id] = row.count;

  // Canh bao ton kho thap (<= 5)
  const lowStockCount = await Variant.countDocuments({ stock: { $lte: 5 } });

  // 5 don hang moi nhat
  const recentOrdersRaw: any[] = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .lean();
  const recentOrders = recentOrdersRaw.map((o) => ({
    id: String(o._id),
    customer: o.user?.name || o.address?.fullName || 'Khach vang lai',
    total: o.total || 0,
    status: o.status,
    createdAt: o.createdAt,
    itemCount: (o.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0),
  }));

  return {
    productCount,
    activeProductCount,
    variantCount,
    brandCount,
    categoryCount,
    userCount,
    adminCount,
    orderCount,
    pendingReviews,
    revenue,
    lowStockCount,
    ordersByStatus,
    recentOrders,
  };
}

// ================================================================ PRODUCTS ===
function normalizeProduct(product: any, variants: any[] = []) {
  const prices = variants.map((v) => v.price).filter((p) => typeof p === 'number');
  const stock = variants.reduce((s, v) => s + (v.stock || 0), 0);
  return {
    id: String(product._id),
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    brand: product.brand ? { id: String(product.brand._id || product.brand), name: product.brand.name } : null,
    category: product.category
      ? { id: String(product.category._id || product.category), name: product.category.name }
      : null,
    images: product.images || [],
    gender: product.gender || '',
    fragranceFamily: product.fragranceFamily || '',
    concentration: product.concentration || '',
    season: product.season || [],
    notes: product.notes || { top: [], middle: [], base: [] },
    isActive: product.isActive !== false,
    variantCount: variants.length,
    minPrice: prices.length ? Math.min(...prices) : null,
    stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function listProducts(query: Record<string, any> = {}) {
  const { page, limit, skip } = paginate(query.page, query.limit);
  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: String(query.search).trim(), $options: 'i' } },
      { slug: { $regex: String(query.search).trim(), $options: 'i' } },
    ];
  }
  if (query.brand) filter.brand = query.brand;
  if (query.category) filter.category = query.category;
  if (query.status === 'active') filter.isActive = true;
  if (query.status === 'inactive') filter.isActive = false;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('brand', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const ids = products.map((p: any) => p._id);
  const variants: any[] = await Variant.find({ product: { $in: ids } })
    .select('product price stock')
    .lean();
  const byProduct = new Map<string, any[]>();
  for (const v of variants) {
    const key = String(v.product);
    byProduct.set(key, [...(byProduct.get(key) || []), v]);
  }

  return {
    data: products.map((p: any) => normalizeProduct(p, byProduct.get(String(p._id)) || [])),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getProduct(id: string) {
  const product: any = await Product.findById(id)
    .populate('brand', 'name')
    .populate('category', 'name')
    .lean();
  if (!product) throw httpError('Khong tim thay san pham', 404);
  const variants: any[] = await Variant.find({ product: id }).sort({ price: 1 }).lean();
  return {
    ...normalizeProduct(product, variants),
    variants: variants.map((v) => ({
      id: String(v._id),
      sku: v.sku,
      volume: v.volume || v.size || '',
      price: v.price,
      stock: v.stock || 0,
      images: v.images || [],
      isActive: v.isActive !== false,
    })),
  };
}

export async function createProduct(input: any) {
  if (!input?.name?.trim()) throw httpError('Ten san pham la bat buoc');
  const slug = input.slug?.trim() ? await uniqueSlug(input.slug, undefined) : await uniqueSlug(input.name);

  const product: any = await Product.create({
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || '',
    brand: input.brand || undefined,
    category: input.category || undefined,
    images: Array.isArray(input.images) ? input.images.filter(Boolean) : [],
    gender: input.gender || '',
    fragranceFamily: input.fragranceFamily || '',
    concentration: input.concentration || '',
    season: Array.isArray(input.season) ? input.season : [],
    notes: {
      top: input.notes?.top || [],
      middle: input.notes?.middle || [],
      base: input.notes?.base || [],
    },
    isActive: input.isActive !== false,
  });
  return getProduct(String(product._id));
}

export async function updateProduct(id: string, input: any) {
  const product: any = await Product.findById(id);
  if (!product) throw httpError('Khong tim thay san pham', 404);

  if (input.name !== undefined) product.name = input.name.trim();
  if (input.slug !== undefined && input.slug.trim()) {
    product.slug = await uniqueSlug(input.slug, id);
  }
  if (input.description !== undefined) product.description = input.description;
  if (input.brand !== undefined) product.brand = input.brand || undefined;
  if (input.category !== undefined) product.category = input.category || undefined;
  if (input.images !== undefined) product.images = Array.isArray(input.images) ? input.images.filter(Boolean) : [];
  if (input.gender !== undefined) product.gender = input.gender;
  if (input.fragranceFamily !== undefined) product.fragranceFamily = input.fragranceFamily;
  if (input.concentration !== undefined) product.concentration = input.concentration;
  if (input.season !== undefined) product.season = Array.isArray(input.season) ? input.season : [];
  if (input.notes !== undefined) {
    product.notes = {
      top: input.notes?.top || [],
      middle: input.notes?.middle || [],
      base: input.notes?.base || [],
    };
  }
  if (input.isActive !== undefined) product.isActive = Boolean(input.isActive);

  await product.save();
  return getProduct(id);
}

export async function deleteProduct(id: string) {
  const product = await Product.findById(id);
  if (!product) throw httpError('Khong tim thay san pham', 404);
  // Xoa luon cac bien the con lai de tranh du lieu mo coi
  await Variant.deleteMany({ product: id });
  await product.deleteOne();
  return { id, deleted: true };
}

// ================================================================ VARIANTS ===
export async function listVariants(query: Record<string, any> = {}) {
  const filter: Record<string, unknown> = {};
  if (query.product) filter.product = query.product;
  if (query.lowStock === 'true' || query.lowStock === true) filter.stock = { $lte: 5 };
  if (query.search) filter.sku = { $regex: String(query.search).trim(), $options: 'i' };

  const variants: any[] = await Variant.find(filter)
    .populate('product', 'name slug images')
    .sort({ createdAt: -1 })
    .lean();

  return variants.map((v) => ({
    id: String(v._id),
    sku: v.sku,
    volume: v.volume || v.size || '',
    price: v.price,
    stock: v.stock || 0,
    images: v.images || [],
    isActive: v.isActive !== false,
    product: v.product
      ? { id: String(v.product._id), name: v.product.name, slug: v.product.slug }
      : null,
    createdAt: v.createdAt,
  }));
}

export async function createVariant(input: any) {
  if (!input?.product) throw httpError('Thieu san pham cho bien the');
  if (!input?.sku?.trim()) throw httpError('SKU la bat buoc');
  if (input.price === undefined || input.price === null) throw httpError('Gia la bat buoc');

  const productExists = await Product.exists({ _id: input.product });
  if (!productExists) throw httpError('San pham khong ton tai', 404);

  const existed = await Variant.findOne({ sku: input.sku.trim() });
  if (existed) throw httpError('SKU da ton tai', 409);

  const variant: any = await Variant.create({
    product: input.product,
    sku: input.sku.trim(),
    volume: input.volume?.trim() || '',
    price: Number(input.price),
    stock: Number(input.stock || 0),
    images: Array.isArray(input.images) ? input.images.filter(Boolean) : [],
    isActive: input.isActive !== false,
  });
  return variant.toObject();
}

export async function updateVariant(id: string, input: any) {
  const variant: any = await Variant.findById(id);
  if (!variant) throw httpError('Khong tim thay bien the', 404);

  if (input.sku !== undefined && input.sku.trim() !== variant.sku) {
    const dup = await Variant.findOne({ sku: input.sku.trim(), _id: { $ne: id } });
    if (dup) throw httpError('SKU da ton tai', 409);
    variant.sku = input.sku.trim();
  }
  if (input.product !== undefined) variant.product = input.product;
  if (input.volume !== undefined) variant.volume = input.volume;
  if (input.price !== undefined) variant.price = Number(input.price);
  if (input.stock !== undefined) variant.stock = Number(input.stock);
  if (input.images !== undefined) variant.images = Array.isArray(input.images) ? input.images.filter(Boolean) : [];
  if (input.isActive !== undefined) variant.isActive = Boolean(input.isActive);

  await variant.save();
  return variant.toObject();
}

export async function deleteVariant(id: string) {
  const variant = await Variant.findByIdAndDelete(id);
  if (!variant) throw httpError('Khong tim thay bien the', 404);
  return { id, deleted: true };
}

// ================================================================== BRANDS ===
export async function listBrands() {
  const brands: any[] = await Brand.find().sort({ name: 1 }).lean();
  const counts: any[] = await Product.aggregate([
    { $match: { brand: { $ne: null } } },
    { $group: { _id: '$brand', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  return brands.map((b) => ({
    id: String(b._id),
    name: b.name,
    productCount: countMap.get(String(b._id)) || 0,
    createdAt: b.createdAt,
  }));
}

export async function createBrand(input: any) {
  if (!input?.name?.trim()) throw httpError('Ten thuong hieu la bat buoc');
  const existed = await Brand.findOne({ name: input.name.trim() });
  if (existed) throw httpError('Thuong hieu da ton tai', 409);
  const brand: any = await Brand.create({ name: input.name.trim() });
  return { id: String(brand._id), name: brand.name, productCount: 0 };
}

export async function updateBrand(id: string, input: any) {
  if (!input?.name?.trim()) throw httpError('Ten thuong hieu la bat buoc');
  const brand: any = await Brand.findByIdAndUpdate(
    id,
    { name: input.name.trim() },
    { new: true, runValidators: true },
  );
  if (!brand) throw httpError('Khong tim thay thuong hieu', 404);
  return { id: String(brand._id), name: brand.name };
}

export async function deleteBrand(id: string) {
  const inUse = await Product.countDocuments({ brand: id });
  if (inUse > 0) throw httpError(`Khong the xoa: con ${inUse} san pham dang dung thuong hieu nay`, 409);
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) throw httpError('Khong tim thay thuong hieu', 404);
  return { id, deleted: true };
}

// ============================================================== CATEGORIES ===
export async function listCategories() {
  const categories: any[] = await Category.find().sort({ name: 1 }).lean();
  const counts: any[] = await Product.aggregate([
    { $match: { category: { $ne: null } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  return categories.map((c) => ({
    id: String(c._id),
    name: c.name,
    productCount: countMap.get(String(c._id)) || 0,
    createdAt: c.createdAt,
  }));
}

export async function createCategory(input: any) {
  if (!input?.name?.trim()) throw httpError('Ten danh muc la bat buoc');
  const existed = await Category.findOne({ name: input.name.trim() });
  if (existed) throw httpError('Danh muc da ton tai', 409);
  const category: any = await Category.create({ name: input.name.trim() });
  return { id: String(category._id), name: category.name, productCount: 0 };
}

export async function updateCategory(id: string, input: any) {
  if (!input?.name?.trim()) throw httpError('Ten danh muc la bat buoc');
  const category: any = await Category.findByIdAndUpdate(
    id,
    { name: input.name.trim() },
    { new: true, runValidators: true },
  );
  if (!category) throw httpError('Khong tim thay danh muc', 404);
  return { id: String(category._id), name: category.name };
}

export async function deleteCategory(id: string) {
  const inUse = await Product.countDocuments({ category: id });
  if (inUse > 0) throw httpError(`Khong the xoa: con ${inUse} san pham dang dung danh muc nay`, 409);
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw httpError('Khong tim thay danh muc', 404);
  return { id, deleted: true };
}

// ================================================================== ORDERS ===
function normalizeOrder(order: any, payment?: any) {
  return {
    id: String(order._id),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    total: order.total || 0,
    note: order.note || '',
    address: order.address || null,
    customer: order.user
      ? { id: String(order.user._id), name: order.user.name, email: order.user.email }
      : null,
    itemCount: (order.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0),
    items: (order.items || []).map((it: any) => ({
      variant: it.variant ? String(it.variant) : '',
      name: it.name,
      volume: it.volume,
      price: it.price || 0,
      quantity: it.quantity || 0,
      lineTotal: (it.price || 0) * (it.quantity || 0),
    })),
    payment: payment
      ? { method: payment.method, status: payment.status, amount: payment.amount }
      : null,
  };
}

export async function listOrders(query: Record<string, any> = {}) {
  const { page, limit, skip } = paginate(query.page, query.limit);
  const filter: Record<string, unknown> = {};
  if (query.status && ORDER_STATUSES.includes(query.status)) filter.status = query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'name email').lean(),
    Order.countDocuments(filter),
  ]);

  const ids = orders.map((o: any) => o._id);
  const payments: any[] = await Payment.find({ order: { $in: ids } }).lean();
  const payMap = new Map(payments.map((p) => [String(p.order), p]));

  return {
    data: orders.map((o: any) => normalizeOrder(o, payMap.get(String(o._id)))),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getOrder(id: string) {
  let order: any = null;
  try {
    order = await Order.findById(id).populate('user', 'name email').lean();
  } catch {
    throw httpError('Khong tim thay don hang', 404);
  }
  if (!order) throw httpError('Khong tim thay don hang', 404);
  const payment: any = await Payment.findOne({ order: order._id }).lean();
  return normalizeOrder(order, payment);
}

export async function updateOrderStatus(id: string, status: string) {
  if (!ORDER_STATUSES.includes(status as OrderStatus)) throw httpError('Trang thai don hang khong hop le');
  const order: any = await Order.findById(id);
  if (!order) throw httpError('Khong tim thay don hang', 404);

  const wasCancelled = order.status === 'cancelled';
  order.status = status;
  await order.save();

  // Huy don -> hoan lai ton kho (chi 1 lan) va danh dau thanh toan la unpaid
  if (status === 'cancelled' && !wasCancelled) {
    const items = (order.items || []).map((it: any) => ({
      variant: String(it.variant),
      quantity: it.quantity,
    }));
    await restoreStock(items);
    await Payment.updateOne({ order: order._id }, { status: 'unpaid' });
  }

  // Da thanh toan / hoan tat -> dong bo trang thai thanh toan
  if (status === 'paid' || status === 'done') {
    await Payment.updateOne({ order: order._id }, { status: 'paid' });
  }

  return getOrder(id);
}

export async function updatePaymentStatus(id: string, status: string) {
  if (!PAYMENT_STATUSES.includes(status as PaymentStatus)) throw httpError('Trang thai thanh toan khong hop le');
  const order = await Order.findById(id);
  if (!order) throw httpError('Khong tim thay don hang', 404);
  const payment = await Payment.findOneAndUpdate({ order: id }, { status }, { new: true });
  if (!payment) throw httpError('Khong tim thay ban ghi thanh toan', 404);
  return getOrder(id);
}

// =================================================================== USERS ===
function normalizeUser(user: any) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    loyaltyPoints: user.loyaltyPoints || 0,
    isEmailVerified: Boolean(user.isEmailVerified),
    addressCount: (user.addresses || []).length,
    lastLoginAt: user.lastLoginAt || null,
    createdAt: user.createdAt,
  };
}

export async function listUsers(query: Record<string, any> = {}) {
  const { page, limit, skip } = paginate(query.page, query.limit);
  const filter: Record<string, unknown> = {};
  if (query.role === 'admin' || query.role === 'customer') filter.role = query.role;
  if (query.search) {
    filter.$or = [
      { name: { $regex: String(query.search).trim(), $options: 'i' } },
      { email: { $regex: String(query.search).trim(), $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  // Dem so don cua tung user
  const ids = users.map((u: any) => u._id);
  const orderCounts: any[] = await Order.aggregate([
    { $match: { user: { $in: ids } } },
    { $group: { _id: '$user', count: { $sum: 1 } } },
  ]);
  const orderMap = new Map(orderCounts.map((o) => [String(o._id), o.count]));

  return {
    data: users.map((u: any) => ({ ...normalizeUser(u), orderCount: orderMap.get(String(u._id)) || 0 })),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function updateUserRole(id: string, role: string, currentUserId: string) {
  if (!['admin', 'customer'].includes(role)) throw httpError('Vai tro khong hop le');
  if (String(id) === String(currentUserId) && role !== 'admin') {
    throw httpError('Khong the tu ha quyen admin cua chinh minh', 400);
  }
  const user: any = await User.findByIdAndUpdate(id, { role }, { new: true }).lean();
  if (!user) throw httpError('Khong tim thay nguoi dung', 404);
  return normalizeUser(user);
}

export async function deleteUser(id: string, currentUserId: string) {
  if (String(id) === String(currentUserId)) throw httpError('Khong the xoa tai khoan cua chinh minh', 400);
  const user = await User.findByIdAndDelete(id);
  if (!user) throw httpError('Khong tim thay nguoi dung', 404);
  return { id, deleted: true };
}

// ================================================================= REVIEWS ===
function normalizeReview(review: any) {
  return {
    id: String(review._id),
    product: review.product ? { id: String(review.product._id || review.product), name: review.product.name } : null,
    userName: review.user?.name || review.guestName || 'Khach hang',
    guestEmail: review.guestEmail || review.user?.email || '',
    rating: review.rating,
    comment: review.comment || '',
    images: review.images || [],
    approved: Boolean(review.approved),
    createdAt: review.createdAt,
  };
}

export async function listReviews(status?: string) {
  const filter: Record<string, unknown> = {};
  if (status === 'pending') filter.approved = false;
  if (status === 'approved') filter.approved = true;
  const reviews: any[] = await Review.find(filter)
    .populate('user', 'name email')
    .populate('product', 'name slug')
    .sort({ createdAt: -1 })
    .lean();
  return reviews.map(normalizeReview);
}

export async function setReviewApproval(id: string, approved: boolean) {
  const review: any = await Review.findByIdAndUpdate(id, { approved }, { new: true })
    .populate('user', 'name email')
    .populate('product', 'name slug');
  if (!review) throw httpError('Khong tim thay danh gia', 404);
  return normalizeReview(review);
}

export async function deleteReview(id: string) {
  const review = await Review.findByIdAndDelete(id);
  if (!review) throw httpError('Khong tim thay danh gia', 404);
  return { id, deleted: true };
}
