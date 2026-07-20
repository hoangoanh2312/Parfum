import mongoose from 'mongoose';
import { Variant } from '../models/variant.model';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { User } from '../models/user.model';
import { Voucher } from '../models/voucher.model';
import { computeTotals, Totals, Voucherish } from '../utils/pricing';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import '../models/product.model';

export type StockItem = { variant: string; quantity: number };

export interface OrderAddressInput {
  fullName?: string;
  phone?: string;
  line?: string;
  detail?: string;
  ward?: string;
  district?: string;
  province?: string;
  city?: string;
}

export interface CreateOrderOptions {
  method?: 'cod' | 'bank_qr';
  address?: OrderAddressInput;
  note?: string;
  items?: StockItem[];
  voucherCode?: string;
}

/**
 * Kiem tra ton kho cho 1 danh sach item. Chi doc, khong thay doi du lieu.
 */
export async function checkStock(items: StockItem[]) {
  const problems: any[] = [];
  const detailed: any[] = [];

  for (const it of items) {
    const qty = Number(it.quantity);
    const v: any = await Variant.findById(it.variant).populate('product');

    if (!v) {
      problems.push({ variant: it.variant, reason: 'not_found' });
      continue;
    }
    if (!qty || qty < 1) {
      problems.push({ variant: it.variant, reason: 'invalid_quantity' });
      continue;
    }
    const available = Number(v.stock) || 0;
    if (available < qty) {
      problems.push({
        variant: it.variant,
        reason: 'out_of_stock',
        available,
        requested: qty,
      });
    }

    detailed.push({
      variant: String(v._id),
      name: v.product?.name,
      volume: v.volume,
      price: v.price,
      quantity: qty,
      lineTotal: v.price * qty,
      available,
    });
  }

  const total = detailed.reduce((s, x) => s + x.lineTotal, 0);
  return { ok: problems.length === 0, problems, items: detailed, total };
}

/**
 * TRU ton kho an toan (chong race condition) bang dieu kien { stock: { $gte: qty } }.
 * Neu 1 item that bai -> tu HOAN LAI cac item da tru truoc do.
 */
export async function decrementStock(items: StockItem[]) {
  const done: StockItem[] = [];

  for (const it of items) {
    const qty = Number(it.quantity);
    const result = await Variant.updateOne(
      { _id: it.variant, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
    );

    if (result.modifiedCount !== 1) {
      await restoreStock(done);
      throw Object.assign(new Error('San pham khong du ton kho'), {
        status: 409,
        variant: it.variant,
      });
    }
    done.push({ variant: it.variant, quantity: qty });
  }

  return done;
}

/** TRU ton kho trong pham vi 1 transaction (session). Neu loi -> withTransaction tu rollback. */
async function decrementStockSession(items: StockItem[], session: mongoose.ClientSession) {
  for (const it of items) {
    const qty = Number(it.quantity);
    const result = await Variant.updateOne(
      { _id: it.variant, stock: { $gte: qty } },
      { $inc: { stock: -qty } },
      { session },
    );
    if (result.modifiedCount !== 1) {
      throw Object.assign(new Error('San pham khong du ton kho'), {
        status: 409,
        variant: it.variant,
      });
    }
  }
}

/** HOAN lai ton kho (dung khi huy don hoac thanh toan that bai). */
export async function restoreStock(items: StockItem[]) {
  for (const it of items) {
    await Variant.updateOne({ _id: it.variant }, { $inc: { stock: Number(it.quantity) } });
  }
}

/**
 * CHUAN BI CHECKOUT: lay gio hang cua user, kiem tra ton kho, tinh tong tien.
 */
export async function prepareCheckout(userId: string) {
  const cart: any = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw Object.assign(new Error('Gio hang trong'), { status: 400 });
  }

  const items: StockItem[] = cart.items.map((i: any) => ({
    variant: String(i.variant),
    quantity: i.quantity,
  }));

  return checkStock(items);
}

/** Chuan hoa dia chi giao hang ve 1 shape thong nhat. */
function normalizeOrderAddress(a: OrderAddressInput = {}) {
  return {
    fullName: (a.fullName || '').trim() || undefined,
    phone: (a.phone || '').trim(),
    line: (a.line || a.detail || '').trim(),
    ward: (a.ward || '').trim() || undefined,
    district: (a.district || '').trim() || undefined,
    province: (a.province || '').trim() || undefined,
    city: (a.city || '').trim() || undefined,
  };
}

/** Tra ve thong tin voucher hop le hoac null. Neu ma duoc nhap nhung khong hop le -> nem 400. */
async function resolveVoucher(code?: string): Promise<Voucherish | null> {
  if (!code || !code.trim()) return null;
  const now = new Date();
  const voucher: any = await Voucher.findOne({
    code: code.trim().toUpperCase(),
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  }).lean();

  if (!voucher) throw Object.assign(new Error('Ma giam gia khong hop le hoac da het han'), { status: 400 });
  if (voucher.usageLimit && voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
    throw Object.assign(new Error('Ma giam gia da het luot su dung'), { status: 400 });
  }

  return {
    type: voucher.type,
    value: voucher.value,
    minOrder: voucher.minOrder,
    maxDiscount: voucher.maxDiscount,
  };
}

/**
 * TAO DON HANG THAT (checkout).
 * Luong: kiem tra ton kho -> tinh tien (voucher/ship/thue/diem) -> TRU kho -> tao Order + Payment
 * -> cong loyalty points -> xoa gio. Uu tien dung Mongo transaction; neu DB khong ho tro
 * (khong phai replica set) thi fallback ve co che rollback thu cong.
 */
export async function createOrder(userId: string | undefined, opts: CreateOrderOptions = {}) {
  const cart: any = userId ? await Cart.findOne({ user: userId }) : null;

  const stockItems: StockItem[] = cart?.items?.length
    ? cart.items.map((i: any) => ({ variant: String(i.variant), quantity: i.quantity }))
    : (opts.items || []).map((item) => ({ variant: String(item.variant), quantity: Number(item.quantity) }));

  if (!stockItems.length) {
    throw Object.assign(new Error('Gio hang trong'), { status: 400 });
  }

  // 1) Kiem tra ton kho
  const check = await checkStock(stockItems);
  if (!check.ok) {
    throw Object.assign(new Error('Mot so san pham khong du ton kho'), {
      status: 409,
      problems: check.problems,
    });
  }

  // 2) Tinh tien (subtotal -> voucher -> ship -> thue -> diem thuong)
  const voucher = await resolveVoucher(opts.voucherCode);
  const totals: Totals = computeTotals(check.total, voucher);
  const method = opts.method === 'bank_qr' ? 'bank_qr' : 'cod';
  const address = normalizeOrderAddress(opts.address);
  const orderItems = check.items.map((x: any) => ({
    variant: x.variant,
    name: x.name,
    volume: x.volume,
    price: x.price,
    quantity: x.quantity,
  }));

  const buildDoc = () => ({
    ...(userId ? { user: userId } : {}),
    items: orderItems,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingFee: totals.shippingFee,
    tax: totals.tax,
    total: totals.total,
    voucherCode: voucher && opts.voucherCode ? opts.voucherCode.trim().toUpperCase() : undefined,
    pointsEarned: totals.pointsEarned,
    status: 'pending' as const,
    address,
    note: opts.note,
  });

  let created: any = null;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await decrementStockSession(stockItems, session);
      const docs = await Order.create([buildDoc()], { session });
      created = docs[0];
      await Payment.create([{ order: created._id, method, status: 'unpaid', amount: totals.total }], { session });
      if (userId && totals.pointsEarned) {
        await User.updateOne({ _id: userId }, { $inc: { loyaltyPoints: totals.pointsEarned } }, { session });
      }
      if (voucher && opts.voucherCode) {
        await Voucher.updateOne({ code: opts.voucherCode.trim().toUpperCase() }, { $inc: { usedCount: 1 } }, { session });
      }
      if (cart) {
        cart.items = [];
        await cart.save({ session });
      }
    });
  } catch (txnErr: any) {
    const msg = String(txnErr?.message || '');
    const unsupported =
      txnErr?.code === 20 ||
      txnErr?.codeName === 'IllegalOperation' ||
      /Transaction numbers|replica set|not support|Transactions are not/i.test(msg);
    if (!unsupported) throw txnErr;
    logger.warn('[order] Mongo khong ho tro transaction -> dung fallback rollback thu cong');
    created = await createOrderFallback({ userId, cart, stockItems, doc: buildDoc(), method, totals, voucher, voucherCode: opts.voucherCode });
  } finally {
    await session.endSession();
  }

  return {
    orderId: String(created._id),
    total: totals.total,
    status: created.status,
    method,
    totals,
  };
}

async function createOrderFallback(p: {
  userId?: string;
  cart: any;
  stockItems: StockItem[];
  doc: any;
  method: 'cod' | 'bank_qr';
  totals: Totals;
  voucher: Voucherish | null;
  voucherCode?: string;
}) {
  await decrementStock(p.stockItems);
  try {
    const order: any = await Order.create(p.doc);
    await Payment.create({ order: order._id, method: p.method, status: 'unpaid', amount: p.totals.total });
    if (p.userId && p.totals.pointsEarned) {
      await User.updateOne({ _id: p.userId }, { $inc: { loyaltyPoints: p.totals.pointsEarned } });
    }
    if (p.voucher && p.voucherCode) {
      await Voucher.updateOne({ code: p.voucherCode.trim().toUpperCase() }, { $inc: { usedCount: 1 } });
    }
    if (p.cart) {
      p.cart.items = [];
      await p.cart.save();
    }
    return order;
  } catch (err) {
    await restoreStock(p.stockItems);
    throw err;
  }
}

/** HUY DON cua user: chi cho phep khi don dang pending/paid; hoan kho + tru diem da cong. */
export async function cancelOrder(userId: string, orderId: string) {
  let order: any = null;
  try {
    order = await Order.findOne({ _id: orderId, user: userId });
  } catch {
    throw Object.assign(new Error('Khong tim thay don hang'), { status: 404 });
  }
  if (!order) throw Object.assign(new Error('Khong tim thay don hang'), { status: 404 });
  if (!['pending', 'paid'].includes(order.status)) {
    throw Object.assign(new Error('Khong the huy don o trang thai nay'), { status: 400 });
  }

  await restoreStock((order.items || []).map((it: any) => ({ variant: String(it.variant), quantity: it.quantity })));
  order.status = 'cancelled';
  await order.save();
  if (userId && order.pointsEarned) {
    await User.updateOne({ _id: userId }, { $inc: { loyaltyPoints: -order.pointsEarned } });
  }
  await Payment.updateOne({ order: order._id }, { status: 'unpaid' });

  return { orderId: String(order._id), status: order.status };
}

/** Danh sach don cua 1 user (moi nhat truoc). */
export async function getMyOrders(userId: string) {
  const orders: any[] = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();

  const ids = orders.map((o) => o._id);
  const payments: any[] = await Payment.find({ order: { $in: ids } }).lean();
  const payMap = new Map(payments.map((p) => [String(p.order), p]));

  return orders.map((o) => {
    const pay = payMap.get(String(o._id));
    const itemCount = (o.items || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0);
    return {
      id: String(o._id),
      createdAt: o.createdAt,
      total: o.total,
      status: o.status,
      itemCount,
      firstItemName: o.items?.[0]?.name || '',
      payment: pay ? { method: pay.method, status: pay.status } : { method: 'cod', status: 'unpaid' },
    };
  });
}

/** Chi tiet 1 don cua user (chan xem don nguoi khac bang dieu kien { _id, user }). */
export async function getOrderById(userId: string | undefined, orderId: string) {
  let order: any = null;
  try {
    order = await Order.findOne(userId ? { _id: orderId, user: userId } : { _id: orderId }).lean();
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

/** Thong tin thanh toan cho 1 don (COD hoac VietQR). */
export async function getPaymentInfo(userId: string | undefined, orderId: string) {
  let order: any = null;
  try {
    order = await Order.findOne(userId ? { _id: orderId, user: userId } : { _id: orderId }).lean();
  } catch {
    throw Object.assign(new Error('Khong tim thay don hang'), { status: 404 });
  }
  if (!order) throw Object.assign(new Error('Khong tim thay don hang'), { status: 404 });

  const payment: any = await Payment.findOne({ order: order._id }).lean();
  const method = payment?.method || 'cod';
  const status = payment?.status || 'unpaid';
  const amount = payment?.amount ?? order.total ?? 0;

  const transferContent = 'HOCPARFUM ' + String(order._id).slice(-6).toUpperCase();

  const result = {
    orderId: String(order._id),
    method,
    status,
    amount,
    bank: {
      bin: env.vietqr.bankBin,
      accountNo: env.vietqr.accountNo,
      accountName: env.vietqr.accountName,
    },
    transferContent,
    qrUrl: '',
  };

  if (method === 'bank_qr') {
    result.qrUrl =
      'https://img.vietqr.io/image/' +
      env.vietqr.bankBin +
      '-' +
      env.vietqr.accountNo +
      '-compact2.png' +
      '?amount=' +
      encodeURIComponent(String(amount)) +
      '&addInfo=' +
      encodeURIComponent(transferContent) +
      '&accountName=' +
      encodeURIComponent(env.vietqr.accountName);
  }

  return result;
}
