import { Product } from '../models/product.model';
import { Variant } from '../models/variant.model';
import '../models/brand.model';
import '../models/category.model';

type ProductListQuery = {
  page?: string | number;
  limit?: string | number;
  search?: string;
  brand?: string | string[];
  category?: string | string[];
  gender?: string | string[];
  scent?: string | string[];
  fragranceFamily?: string | string[];
  concentration?: string | string[];
  season?: string | string[];
  occasion?: string | string[];
  size?: string | string[];
  minPrice?: string | number;
  maxPrice?: string | number;
  sort?: string;
};

type ProductCard = {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  category: string;
  description?: string;
  gender: string;
  fragranceFamily: string;
  concentration: string;
  season: string[];
  sizes: string[];
  variants?: {
    variantId: string;
    size: string;
    price: number | null;
    stock: number;
  }[];
  image: string | null;
  images?: string[];
  price: number | null;
  priceText: string;
  variantId: string | null;
  volume: string;
  stock: number;
  notes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  createdAt?: Date;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

function formatVnd(n?: number | null) {
  if (n == null) return 'Liên hệ';
  return n.toLocaleString('vi-VN') + 'đ';
}

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value: unknown) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => String(item).split(','));
  }

  if (value == null || value === '') return [];

  return String(value).split(',');
}

function normalize(value: unknown) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function includesAny(value: string | undefined, filters: string[]) {
  if (filters.length === 0) return true;
  const normalizedValue = normalize(value);
  return filters.some((filter) => normalizedValue === normalize(filter));
}

function overlaps(values: string[] | undefined, filters: string[]) {
  if (filters.length === 0) return true;
  const normalizedValues = (values ?? []).map(normalize);
  return filters.some((filter) => normalizedValues.includes(normalize(filter)));
}

function matchesScentProfile(product: ProductCard, filters: string[]) {
  if (filters.length === 0) return true;

  return (
    includesAny(product.fragranceFamily, filters) ||
    overlaps(product.notes?.top, filters) ||
    overlaps(product.notes?.middle, filters) ||
    overlaps(product.notes?.base, filters)
  );
}

function sortProducts(products: ProductCard[], sort?: string) {
  const next = [...products];

  switch (sort) {
    case 'price_asc':
    case 'priceAsc':
      return next.sort(
        (a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER),
      );
    case 'price_desc':
    case 'priceDesc':
      return next.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'name_asc':
      return next.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return next.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
    default:
      return next.sort((a, b) => {
        const left = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const right = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return right - left;
      });
  }
}

/**
 * Lấy danh sách sản phẩm cho Shop.
 * Hỗ trợ filter, sort, pagination, lọc khoảng giá dựa trên giá variant rẻ nhất.
 */
export async function getProducts(query: ProductListQuery = {}) {
  const page = Math.max(1, Math.floor(toNumber(query.page, DEFAULT_PAGE)));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(toNumber(query.limit, DEFAULT_LIMIT))));
  const minPrice =
    query.minPrice === undefined ? undefined : Math.max(0, toNumber(query.minPrice, 0));
  const maxPrice =
    query.maxPrice === undefined ? undefined : Math.max(0, toNumber(query.maxPrice, 0));

  const search = normalize(query.search);
  const brandFilters = toList(query.brand);
  const categoryFilters = toList(query.category);
  const genderFilters = toList(query.gender);
  const scentFilters = [...toList(query.scent), ...toList(query.fragranceFamily)];
  const concentrationFilters = toList(query.concentration);
  const seasonFilters = [...toList(query.season), ...toList(query.occasion)];
  const sizeFilters = toList(query.size);

  const productQuery: Record<string, unknown> = { isActive: true };

  if (search) {
    productQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  const products: any[] = await Product.find(productQuery)
    .populate('brand', 'name')
    .populate('category', 'name')
    .lean();

  const ids = products.map((product) => product._id);
  const variants: any[] = await Variant.find({ product: { $in: ids } }).lean();

  const byProduct: Record<string, any[]> = {};
  for (const variant of variants) {
    const key = String(variant.product);
    (byProduct[key] ||= []).push(variant);
  }

  const cards: ProductCard[] = products.map((product) => {
    const productVariants = byProduct[String(product._id)] || [];
    const cheapest = productVariants.reduce(
      (min: any, variant: any) => (min == null || variant.price < min.price ? variant : min),
      null as any,
    );
    const stock = productVariants.reduce(
      (sum: number, variant: any) => sum + (variant.stock || 0),
      0,
    );
    const sizes = Array.from(
      new Set(
        productVariants
          .map((variant: any) => variant.size || variant.volume)
          .filter((size: string | undefined) => Boolean(size)),
      ),
    );

    return {
      id: String(product._id),
      slug: product.slug,
      name: product.name,
      brand: product.brand?.name || '',
      category: product.category?.name || '',
      description: product.description,
      gender: product.gender || '',
      fragranceFamily: product.fragranceFamily || '',
      concentration: product.concentration || '',
      season: product.season || [],
      sizes,
      variants: productVariants
        .filter((v: any) => v.size || v.volume)
        .map((v: any) => ({
          variantId: String(v._id),
          size: v.size || v.volume || '',
          price: v.price ?? null,
          stock: v.stock ?? 0,
        }))
        .sort((a: any, b: any) => (a.price ?? Infinity) - (b.price ?? Infinity)),
      image: product.images?.[0] || cheapest?.images?.[0] || null,
      images: product.images || [],
      price: cheapest?.price ?? null,
      priceText: formatVnd(cheapest?.price),
      variantId: cheapest ? String(cheapest._id) : null,
      volume: cheapest?.size || cheapest?.volume || '',
      stock,
      notes: {
        top: product.notes?.top?.length ? product.notes.top : product.topNotes || [],
        middle: product.notes?.middle?.length ? product.notes.middle : product.heartNotes || [],
        base: product.notes?.base?.length ? product.notes.base : product.baseNotes || [],
      },
      createdAt: product.createdAt,
    };
  });

  const filtered = cards.filter((product) => {
    const price = product.price ?? 0;

    return (
      includesAny(product.brand, brandFilters) &&
      includesAny(product.category, categoryFilters) &&
      includesAny(product.gender, genderFilters) &&
      matchesScentProfile(product, scentFilters) &&
      includesAny(product.concentration, concentrationFilters) &&
      overlaps(product.season, seasonFilters) &&
      overlaps(product.sizes, sizeFilters) &&
      (minPrice === undefined || price >= minPrice) &&
      (maxPrice === undefined || price <= maxPrice)
    );
  });

  const sorted = sortProducts(filtered, query.sort);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = sorted
    .slice(start, start + limit)
    .map(({ createdAt: _createdAt, ...product }) => product);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getProductDetail(idOrSlug: string) {
  const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

  const product: any = await Product.findOne(query as any)
    .populate('brand', 'name')
    .populate('category', 'name')
    .lean();

  if (!product) {
    throw Object.assign(new Error('Không tìm thấy sản phẩm'), { status: 404 });
  }

  const variants: any[] = await Variant.find({ product: product._id })
    .sort({ price: 1 })
    .lean();

  const normalizedVariants = variants.map((variant) => ({
    id: String(variant._id),
    sku: variant.sku,
    size: variant.size || variant.volume || '',
    volume: variant.size || variant.volume || '',
    price: variant.price,
    priceText: formatVnd(variant.price),
    stock: variant.stock || 0,
    images: variant.images || [],
    isActive: variant.isActive !== false,
  }));

  const variantImages = normalizedVariants.flatMap((variant) => variant.images);
  const gallery = Array.from(new Set([...(product.images || []), ...variantImages]));
  const stock = normalizedVariants.reduce((sum, variant) => sum + (variant.stock || 0), 0);

  return {
    id: String(product._id),
    slug: product.slug || String(product._id),
    name: product.name,
    brand: product.brand?.name || '',
    category: product.category?.name || '',
    description: product.description || '',
    gender: product.gender || '',
    fragranceFamily: product.fragranceFamily || '',
    concentration: product.concentration || '',
    season: product.season || [],
    gallery,
    images: gallery,
    notes: {
      top: product.notes?.top?.length ? product.notes.top : product.topNotes || [],
      middle: product.notes?.middle?.length ? product.notes.middle : product.heartNotes || [],
      base: product.notes?.base?.length ? product.notes.base : product.baseNotes || [],
    },
    variants: normalizedVariants,
    stock,
    isActive: product.isActive !== false,
  };
}


/**
 * Lấy toàn bộ facet lọc (brand, nhóm mùi hương, nồng độ, size, giới tính, mùa, giá max)
 * tính trên TẤT CẢ sản phẩm đang active trong MongoDB (không giới hạn phân trang).
 * Dùng cho sidebar filter của trang Shop để luôn đồng bộ với dữ liệu thật.
 */
export async function getProductFilters() {
  const products: any[] = await Product.find({ isActive: true })
    .populate('brand', 'name')
    .populate('category', 'name')
    .lean();

  const ids = products.map((product) => product._id);
  const variants: any[] = await Variant.find({ product: { $in: ids } }).lean();

  const byProduct: Record<string, any[]> = {};
  for (const variant of variants) {
    (byProduct[String(variant.product)] ||= []).push(variant);
  }

  const brandSet = new Set<string>();
  const familySet = new Set<string>();
  const concentrationSet = new Set<string>();
  const genderSet = new Set<string>();
  const seasonSet = new Set<string>();
  const categorySet = new Set<string>();
  const sizeSet = new Set<string>();
  let maxPrice = 0;
  let minPrice = Number.POSITIVE_INFINITY;
  const brandCounts: Record<string, number> = {};
  const productPrices: number[] = [];

  for (const product of products) {
    if (product.brand?.name) {
      const brandName = String(product.brand.name).trim();
      brandSet.add(brandName);
      brandCounts[brandName] = (brandCounts[brandName] || 0) + 1;
    }
    if (product.category?.name) categorySet.add(String(product.category.name).trim());
    if (product.fragranceFamily) familySet.add(String(product.fragranceFamily).trim());
    if (product.concentration) concentrationSet.add(String(product.concentration).trim());
    if (product.gender) genderSet.add(String(product.gender).trim());
    for (const season of product.season || []) {
      if (season) seasonSet.add(String(season).trim());
    }

    let cheapest = Number.POSITIVE_INFINITY;
    for (const variant of byProduct[String(product._id)] || []) {
      const size = variant.size || variant.volume;
      if (size) sizeSet.add(String(size).trim());
      if (typeof variant.price === 'number') {
        if (variant.price > maxPrice) maxPrice = variant.price;
        if (variant.price < cheapest) cheapest = variant.price;
      }
    }
    if (cheapest !== Number.POSITIVE_INFINITY) {
      productPrices.push(cheapest);
      if (cheapest < minPrice) minPrice = cheapest;
    }
  }

  const PRICE_BUCKETS = 28;
  const priceLo = Number.isFinite(minPrice) ? minPrice : 0;
  const priceHi = maxPrice > priceLo ? maxPrice : priceLo + 1;
  const priceBuckets = new Array(PRICE_BUCKETS).fill(0);
  for (const value of productPrices) {
    let idx = Math.floor(((value - priceLo) / (priceHi - priceLo)) * PRICE_BUCKETS);
    if (idx < 0) idx = 0;
    if (idx >= PRICE_BUCKETS) idx = PRICE_BUCKETS - 1;
    priceBuckets[idx] += 1;
  }

  const alpha = (a: string, b: string) => a.localeCompare(b);
  const sizeNumber = (size: string) => {
    const match = size.match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
  };

  return {
    brands: Array.from(brandSet).sort(alpha),
    fragranceFamilies: Array.from(familySet).sort(alpha),
    concentrations: Array.from(concentrationSet).sort(alpha),
    genders: Array.from(genderSet).sort(alpha),
    seasons: Array.from(seasonSet).sort(alpha),
    categories: Array.from(categorySet).sort(alpha),
    sizes: Array.from(sizeSet).sort((a, b) => sizeNumber(a) - sizeNumber(b) || alpha(a, b)),
    maxPrice,
    minPrice: Number.isFinite(minPrice) ? minPrice : 0,
    brandCounts,
    priceBuckets,
    total: products.length,
  };
}
