import { Order } from '../models/order.model';
import { Wishlist } from '../models/wishlist.model';
import '../models/product.model';

export async function getOrders(userId: string) {
  const orders: any[] = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();

  return orders.map((order) => ({
    id: String(order._id),
    createdAt: order.createdAt,
    status: order.status,
    total: order.total || 0,
    itemCount: (order.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 0), 0),
    firstItemName: order.items?.[0]?.name || 'Đơn hàng',
    address: order.address || null,
    items: (order.items || []).map((item: any) => ({
      variant: item.variant ? String(item.variant) : '',
      name: item.name || 'Sản phẩm',
      price: item.price || 0,
      quantity: item.quantity || 0,
      lineTotal: (item.price || 0) * (item.quantity || 0),
    })),
  }));
}

export async function getWishlist(userId: string) {
  const wishlist: any = await Wishlist.findOne({ user: userId })
    .populate({
      path: 'products',
      select: 'name slug description images brand category',
      populate: [
        { path: 'brand', select: 'name' },
        { path: 'category', select: 'name' },
      ],
    })
    .lean();

  return (wishlist?.products || []).map((product: any) => ({
    id: String(product._id),
    slug: product.slug,
    name: product.name,
    description: product.description || '',
    brand: product.brand?.name || '',
    category: product.category?.name || '',
    image: product.images?.[0] || null,
    images: product.images || [],
  }));
}

export async function addWishlistItem(userId: string, productId: string) {
  await Wishlist.findOneAndUpdate(
    { user: userId },
    { $addToSet: { products: productId } },
    { upsert: true, new: true },
  );
  return getWishlist(userId);
}

export async function removeWishlistItem(userId: string, productId: string) {
  await Wishlist.findOneAndUpdate(
    { user: userId },
    { $pull: { products: productId } },
    { new: true },
  );
  return getWishlist(userId);
}
