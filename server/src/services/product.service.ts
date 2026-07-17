import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';

// Định dạng tiền VND
function formatVnd(n?: number | null) {
  if (n == null) return 'Liên hệ';
  return n.toLocaleString('vi-VN') + 'đ';
}

/**
 * Lấy danh sách sản phẩm để hiển thị ngoài web.
 * Ghép Product + Brand + Variant (lấy giá RẺ NHẤT làm giá hiển thị "từ ...").
 */
export async function getProducts() {
  const products: any[] = await Product.find({ isActive: true })
    .populate('brand', 'name')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const ids = products.map((p) => p._id);
  const variants: any[] = await Variant.find({ product: { $in: ids } }).lean();

  // Gom variant theo product
  const byProduct: Record<string, any[]> = {};
  for (const v of variants) {
    const key = String(v.product);
    (byProduct[key] ||= []).push(v);
  }

  return products.map((p) => {
    const vs = byProduct[String(p._id)] || [];
    const cheapest = vs.reduce(
      (min: any, v: any) => (min == null || v.price < min.price ? v : min),
      null as any,
    );
    const stock = vs.reduce((s: number, v: any) => s + (v.stock || 0), 0);
    return {
      id: String(p._id),
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name || '',
      category: p.category?.name || '',
      gender: p.gender || '', // female | male | unisex (dùng lọc Shop)
      image: (p.images && p.images[0]) || (cheapest && cheapest.images?.[0]) || null,
      price: cheapest?.price ?? null,
      priceText: formatVnd(cheapest?.price),
      variantId: cheapest ? String(cheapest._id) : null, // dùng cho "Thêm vào giỏ"
      volume: cheapest?.volume || '',
      stock,
    };
  });
}

/** Chi tiết 1 sản phẩm theo id hoặc slug, kèm toàn bộ variant. */
export async function getProductDetail(idOrSlug: string) {
  const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const product: any = await Product.findOne(query as any)
    .populate('brand', 'name')
    .populate('category', 'name')
    .lean();

  if (!product) {
    throw Object.assign(new Error('Không tìm thấy sản phẩm'), { status: 404 });
  }

  const variants = await Variant.find({ product: product._id }).lean();
  return { ...product, variants };
}
