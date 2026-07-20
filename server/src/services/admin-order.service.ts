import { FilterQuery, Types } from 'mongoose';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { User } from '../models/user.model';

const ORDER_STATUSES = ['pending', 'paid', 'shipping', 'done', 'cancelled'] as const;
const PAYMENT_STATUSES = ['unpaid', 'paid'] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

function httpError(message: string, status: number) {
  return Object.assign(new Error(message), { status });
}

function scalar(value: unknown, field: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw httpError(`${field} không hợp lệ`, 400);
  return value;
}

function positiveInteger(value: unknown, field: string, fallback: number, max?: number) {
  if (value === undefined) return fallback;
  const raw = scalar(value, field)!;
  if (!/^[1-9]\d*$/.test(raw)) throw httpError(`${field} không hợp lệ`, 400);
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || (max !== undefined && parsed > max)) {
    throw httpError(`${field} không hợp lệ`, 400);
  }
  return parsed;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validateObjectId(orderId: string) {
  if (!Types.ObjectId.isValid(orderId)) throw httpError('Mã đơn hàng không hợp lệ', 400);
}

function paymentView(payment: any) {
  return payment ? { method: payment.method, status: payment.status, amount: payment.amount } : null;
}

function orderView(order: any, payment: any) {
  return {
    id: String(order._id),
    customer: order.user
      ? { id: String(order.user._id), name: order.user.name, email: order.user.email }
      : null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    total: order.total,
    status: order.status,
    address: order.address || null,
    note: order.note || '',
    items: (order.items || []).map((item: any) => ({
      variant: String(item.variant),
      name: item.name,
      volume: item.volume,
      price: item.price,
      quantity: item.quantity,
      lineTotal: item.price * item.quantity,
    })),
    payment: paymentView(payment),
  };
}

function orderListView(order: any, payment: any) {
  return {
    id: String(order._id),
    customer: order.user
      ? { id: String(order.user._id), name: order.user.name, email: order.user.email }
      : null,
    createdAt: order.createdAt,
    total: order.total,
    status: order.status,
    payment: paymentView(payment),
  };
}

export async function listOrders(query: Record<string, unknown>) {
  const page = positiveInteger(query.page, 'page', 1);
  const limit = positiveInteger(query.limit, 'limit', 10, 100);
  const search = scalar(query.search, 'search')?.trim();
  const status = scalar(query.status, 'status');
  const paymentStatus = scalar(query.paymentStatus, 'paymentStatus');
  const sort = scalar(query.sort, 'sort') ?? 'newest';

  if (status && !ORDER_STATUSES.includes(status as OrderStatus)) {
    throw httpError('Trạng thái đơn hàng không hợp lệ', 400);
  }
  if (paymentStatus && !PAYMENT_STATUSES.includes(paymentStatus as any)) {
    throw httpError('Trạng thái thanh toán không hợp lệ', 400);
  }
  if (!['newest', 'oldest'].includes(sort)) throw httpError('Kiểu sắp xếp không hợp lệ', 400);

  const filter: FilterQuery<any> = {};
  if (status) filter.status = status;
  if (paymentStatus) {
    filter._id = { $in: await Payment.distinct('order', { status: paymentStatus }) };
  }
  if (search) {
    if (search.length > 100) throw httpError('Từ khóa tìm kiếm quá dài', 400);
    const regex = new RegExp(escapeRegExp(search), 'i');
    const users = await User.find({ $or: [{ name: regex }, { email: regex }] }).select('_id').lean();
    const conditions: FilterQuery<any>[] = [
      { user: { $in: users.map((user) => user._id) } },
      { 'address.phone': regex },
    ];
    if (Types.ObjectId.isValid(search)) conditions.push({ _id: new Types.ObjectId(search) });
    filter.$or = conditions;
  }

  const [orders, totalItems] = await Promise.all([
    Order.find(filter)
      .select('user total status createdAt')
      .populate('user', 'name email')
      .sort({ createdAt: sort === 'oldest' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);
  const payments = await Payment.find({ order: { $in: orders.map((order) => order._id) } })
    .select('order method status amount')
    .lean();
  const paymentByOrder = new Map(payments.map((payment) => [String(payment.order), payment]));

  return {
    items: orders.map((order) => orderListView(order, paymentByOrder.get(String(order._id)))),
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
}

export async function getOrderDetail(orderId: string) {
  validateObjectId(orderId);
  const order = await Order.findById(orderId)
    .select('user items total status address note createdAt updatedAt')
    .populate('user', 'name email')
    .lean();
  if (!order) throw httpError('Không tìm thấy đơn hàng', 404);
  const payment = await Payment.findOne({ order: order._id }).select('method status amount').lean();
  return orderView(order, payment);
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['shipping', 'cancelled'],
  shipping: ['done'],
  done: [],
  cancelled: [],
};

export async function updateOrderStatus(orderId: string, status: unknown) {
  validateObjectId(orderId);
  if (typeof status !== 'string' || !ORDER_STATUSES.includes(status as OrderStatus)) {
    throw httpError('Trạng thái đơn hàng không hợp lệ', 400);
  }
  const order: any = await Order.findById(orderId);
  if (!order) throw httpError('Không tìm thấy đơn hàng', 404);
  if (order.status !== status && !ALLOWED_TRANSITIONS[order.status as OrderStatus].includes(status as OrderStatus)) {
    throw httpError(`Không thể chuyển trạng thái từ ${order.status} sang ${status}`, 409);
  }
  if (order.status !== status) {
    order.status = status;
    await order.save();
  }
  return getOrderDetail(orderId);
}

export async function confirmPayment(orderId: string) {
  validateObjectId(orderId);
  const order: any = await Order.findById(orderId);
  if (!order) throw httpError('Không tìm thấy đơn hàng', 404);
  const payment: any = await Payment.findOne({ order: order._id });
  if (!payment) throw httpError('Không tìm thấy thông tin thanh toán của đơn hàng', 404);

  if (payment.status !== 'paid') {
    payment.status = 'paid';
    await payment.save();
  }
  if (order.status === 'pending') {
    order.status = 'paid';
    await order.save();
  }
  return getOrderDetail(orderId);
}
