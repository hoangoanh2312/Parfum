import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { User } from '../models/user.model';
import { restoreStock } from './order.service';
import { OrderStatus } from '../types/dto';

// So do chuyen trang thai hop le
const FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'shipping', 'cancelled'],
  paid: ['shipping', 'cancelled'],
  shipping: ['done', 'cancelled'],
  done: [],
  cancelled: [],
};

export interface AdminOrderQuery {
  page?: number | string;
  limit?: number | string;
  status?: string;
  sort?: string;
  order?: string;
}

/** Danh sach don co phan trang / loc / sap xep chuan cho admin. */
export async function listOrders(query: AdminOrderQuery = {}) {
  const page = Math.max(1, parseInt(String(query.page), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit), 10) || 20));
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;

  const sortField = ['createdAt', 'total', 'status'].includes(String(query.sort))
    ? String(query.sort)
    : 'createdAt';
  const dir = query.order === 'asc' ? 1 : -1;

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ [sortField]: dir })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email')
      .lean(),
    Order.countDocuments(filter),
  ]);

  const ids = items.map((o: any) => o._id);
  const payments: any[] = await Payment.find({ order: { $in: ids } }).lean();
  const pm = new Map(payments.map((p) => [String(p.order), p]));

  return {
    // FIX: dung key `data` (dong bo voi Paginated<T> phia client va cac endpoint admin khac).
    // Truoc day tra ve `items` khien client doc list.data = undefined -> crash "reading 'length'".
    data: items.map((o: any) => {
      const pay = pm.get(String(o._id));
      return {
        id: String(o._id),
        createdAt: o.createdAt,
        status: o.status,
        total: o.total,
        customer: o.user ? { name: o.user.name, email: o.user.email } : null,
        itemCount: (o.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0),
        payment: pay ? { method: pay.method, status: pay.status } : null,
      };
    }),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getOrder(id: string) {
  let order: any = null;
  try {
    order = await Order.findById(id).populate('user', 'name email').lean();
  } catch {
    throw Object.assign(new Error('Khong tim thay don hang'), { status: 404 });
  }
  if (!order) throw Object.assign(new Error('Khong tim thay don hang'), { status: 404 });

  const payment: any = await Payment.findOne({ order: order._id }).lean();
  return {
    id: String(order._id),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    customer: order.user ? { name: order.user.name, email: order.user.email } : null,
    subtotal: order.subtotal ?? order.total,
    discount: order.discount ?? 0,
    shippingFee: order.shippingFee ?? 0,
    tax: order.tax ?? 0,
    total: order.total,
    voucherCode: order.voucherCode || '',
    pointsEarned: order.pointsEarned ?? 0,
    address: order.address || null,
    note: order.note || '',
    items: (order.items || []).map((it: any) => ({
      variant: String(it.variant),
      name: it.name,
      volume: it.volume,
      price: it.price,
      quantity: it.quantity,
      lineTotal: (it.price || 0) * (it.quantity || 0),
    })),
    payment: payment ? { method: payment.method, status: payment.status, amount: payment.amount } : null,
  };
}

/** Admin cap nhat trang thai don theo so do FLOW. Huy -> hoan kho + tru diem. Paid/done -> danh dau da thanh toan. */
export async function updateStatus(id: string, next: OrderStatus) {
  const order: any = await Order.findById(id);
  if (!order) throw Object.assign(new Error('Khong tim thay don hang'), { status: 404 });

  const allowed = FLOW[order.status as OrderStatus] || [];
  if (!allowed.includes(next)) {
    throw Object.assign(new Error(`Khong the chuyen tu ${order.status} sang ${next}`), { status: 400 });
  }

  if (next === 'cancelled') {
    await restoreStock((order.items || []).map((it: any) => ({ variant: String(it.variant), quantity: it.quantity })));
    if (order.user && order.pointsEarned) {
      await User.updateOne({ _id: order.user }, { $inc: { loyaltyPoints: -order.pointsEarned } });
    }
    await Payment.updateOne({ order: order._id }, { status: 'unpaid' });
  }
  if (next === 'paid' || next === 'done') {
    await Payment.updateOne({ order: order._id }, { status: 'paid' });
  }

  order.status = next;
  await order.save();
  // FIX: tra ve DAY DU don hang (getOrder) thay vi chi { id, status }.
  // Truoc day client setDetail(updated) -> detail.items = undefined -> modal crash "reading 'map'".
  return getOrder(String(order._id));
}

/** Xac nhan da nhan tien chuyen khoan (bank_qr) -> Payment = paid, don pending -> paid. */
export async function confirmPayment(id: string) {
  const payment: any = await Payment.findOneAndUpdate({ order: id }, { status: 'paid' }, { new: true });
  if (!payment) throw Object.assign(new Error('Khong tim thay thanh toan cho don nay'), { status: 404 });
  await Order.updateOne({ _id: id, status: 'pending' }, { status: 'paid' });
  return getOrder(id);
}

/** Admin dat trang thai thanh toan (paid/unpaid). Neu paid va don dang pending -> chuyen don sang paid. */
export async function setPaymentStatus(id: string, status: 'paid' | 'unpaid') {
  const order: any = await Order.findById(id);
  if (!order) throw Object.assign(new Error('Khong tim thay don hang'), { status: 404 });
  await Payment.updateOne({ order: order._id }, { status });
  if (status === 'paid' && order.status === 'pending') {
    order.status = 'paid';
    await order.save();
  }
  return getOrder(String(order._id));
}
