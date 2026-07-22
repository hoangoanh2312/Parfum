import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { Wishlist } from '../models/wishlist.model';
import { User } from '../models/user.model';
import '../models/product.model';
import { normalizeOrderStatus } from '../utils/orderStatus';

const defaultScentProfile = {
  families: ['woody', 'fresh', 'oriental'],
  preferredNotes: ['Oud', 'Amber', 'Bergamot', 'Sandalwood', 'Vanilla', 'Musk'],
  dislikedNotes: ['Tobacco', 'Leather'],
};

export async function getOrders(userId: string) {
  const orders: any[] = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  const payments: any[] = await Payment.find({
    order: { $in: orders.map((order) => order._id) },
  })
    .select('order method status paidAt')
    .lean();
  const paymentByOrder = new Map(
    payments.map((payment) => [String(payment.order), payment]),
  );

  return orders.map((order) => {
    const payment = paymentByOrder.get(String(order._id));

    return {
      id: String(order._id),
      createdAt: order.createdAt,
      status: normalizeOrderStatus(order.status),
      displayStatus: normalizeOrderStatus(order.status),
      payment: payment
        ? {
            method: payment.method,
            status: payment.status,
            paidAt: payment.paidAt || null,
          }
        : null,
      total: order.total || 0,
      itemCount: (order.items || []).reduce(
        (sum: number, item: any) => sum + (item.quantity || 0),
        0,
      ),
      firstItemName: order.items?.[0]?.name || 'Đơn hàng',
      address: order.address || null,
      items: (order.items || []).map((item: any) => ({
        variant: item.variant ? String(item.variant) : '',
        name: item.name || 'Sản phẩm',
        price: item.price || 0,
        quantity: item.quantity || 0,
        lineTotal: (item.price || 0) * (item.quantity || 0),
      })),
    };
  });
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

export async function getScentProfile(userId: string) {
  const user: any = await User.findById(userId).select('scentProfile').lean();
  return {
    families: user?.scentProfile?.families?.length
      ? user.scentProfile.families
      : defaultScentProfile.families,
    preferredNotes: user?.scentProfile?.preferredNotes?.length
      ? user.scentProfile.preferredNotes
      : defaultScentProfile.preferredNotes,
    dislikedNotes: user?.scentProfile?.dislikedNotes || defaultScentProfile.dislikedNotes,
  };
}

export async function updateScentProfile(
  userId: string,
  profile: { families: string[]; preferredNotes: string[]; dislikedNotes: string[] },
) {
  const user: any = await User.findByIdAndUpdate(
    userId,
    { $set: { scentProfile: profile } },
    { new: true },
  )
    .select('scentProfile')
    .lean();

  return user?.scentProfile || profile;
}
