import mongoose from 'mongoose';
import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { Variant } from '../models/variant.model';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';
import { GuestOrderLookup } from '../models/guestOrderLookup.model';
import { Payment } from '../models/payment.model';
import { SupportRequest } from '../models/supportRequest.model';
import { User } from '../models/user.model';
import { Voucher } from '../models/voucher.model';
import { FlashSale } from '../models/flashSale.model';
import { FlashSaleUsage } from '../models/flashSaleUsage.model';
import { VoucherCounter } from '../models/voucherCounter.model';
import {
  pricingCustomerKey,
  PricingQuote,
  quoteOrder,
  resolveVariantPrices,
} from './pricing-engine.service';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { assertValidContact, normalizeEmail, normalizePhone } from '../utils/contactValidation';
import { normalizeOrderStatus } from '../utils/orderStatus';
import { bankTransferNeedsRefund } from '../utils/payment';
import { orderCompletedAt, STANDARD_RETURN_REQUEST_WINDOW_MS } from '../utils/returnPolicy';
import { hashGuestOrderToken } from '../utils/guestOrderAccess';
import { sendOrderNotification } from './notification.service';
import { sendMail } from '../utils/mailer';
import { claimGuestOrdersForUser } from './auth.service';
import '../models/product.model';

export type StockItem = { variant: string; quantity: number };

export interface OrderAddressInput {
  fullName?: string;
  email?: string;
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
  shippingMethod?: 'standard' | 'express';
  address?: OrderAddressInput;
  note?: string;
  items?: StockItem[];
  voucherCode?: string;
}

function orderAccessFilter(userId: string | undefined, orderId: string, token?: string) {
  if (userId) return { _id: orderId, user: userId };
  if (!token) {
    throw Object.assign(new Error('Cần mã truy cập đơn hàng'), { status: 401 });
  }
  return { _id: orderId, guestAccessTokenHash: hashGuestOrderToken(token) };
}

/**
 * Kiem tra ton kho cho 1 danh sach item. Chi doc, khong thay doi du lieu.
 */
export async function checkStock(items: StockItem[]) {
  const problems: any[] = [];
  const detailed: any[] = [];

  for (const it of items) {
    const qty = Number(it.quantity);
    const v: any = await Variant.findById(it.variant).populate({
      path: 'product',
      populate: { path: 'category' },
    });

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
      _doc: v,
      variant: String(v._id),
      name: v.product?.name,
      volume: v.volume,
      price: Number(v.basePrice ?? v.price),
      costPrice: Number(v.costPrice || 0),
      quantity: qty,
      lineTotal: Number(v.basePrice ?? v.price) * qty,
      available,
    });
  }

  const prices = await resolveVariantPrices(detailed.map((item) => item._doc));
  const pricedItems = detailed.map(({ _doc, ...item }) => {
    const resolved = prices.get(item.variant)!;
    const available =
      resolved.flashRemaining == null
        ? item.available
        : Math.min(item.available, resolved.flashRemaining);
    if (
      available < item.quantity &&
      !problems.some((problem) => problem.variant === item.variant)
    ) {
      problems.push({
        variant: item.variant,
        reason: 'out_of_stock',
        available,
        requested: item.quantity,
      });
    }
    return {
      ...item,
      available,
      basePrice: resolved.basePrice,
      price: resolved.finalPrice,
      finalPrice: resolved.finalPrice,
      discountAmount: resolved.discountAmount,
      discountPercent: resolved.discountPercent,
      promotionType: resolved.promotionType,
      promotionName: resolved.promotionName,
      lineTotal: resolved.finalPrice * item.quantity,
    };
  });
  const total = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const originalTotal = pricedItems.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  return {
    ok: problems.length === 0,
    problems,
    items: pricedItems,
    total,
    originalTotal,
    productLevelDiscount: originalTotal - total,
  };
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
      throw Object.assign(new Error('Sản phẩm không đủ tồn kho'), {
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
      throw Object.assign(new Error('Sản phẩm không đủ tồn kho'), {
        status: 409,
        variant: it.variant,
      });
    }
  }
}

/** HOAN lai ton kho (dung khi huy don hoac thanh toan that bai). */
export async function restoreStock(items: StockItem[], session?: mongoose.ClientSession) {
  for (const it of items) {
    await Variant.updateOne(
      { _id: it.variant },
      { $inc: { stock: Number(it.quantity) } },
      { session },
    );
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

  return quoteOrder(items, { userId });
}

/** Chuan hoa dia chi giao hang ve 1 shape thong nhat. */
function normalizeOrderAddress(a: OrderAddressInput = {}) {
  const email = normalizeEmail(a.email || '');
  const phone = normalizePhone(a.phone || '');
  assertValidContact(email, phone);

  return {
    fullName: (a.fullName || '').trim() || undefined,
    email,
    phone,
    line: (a.line || a.detail || '').trim(),
    ward: (a.ward || '').trim() || undefined,
    district: (a.district || '').trim() || undefined,
    province: (a.province || '').trim() || undefined,
    city: (a.city || '').trim() || undefined,
  };
}

/**
 * Khách đã có tài khoản nhưng checkout khi chưa đăng nhập:
 * chỉ gắn đơn khi CẢ email và số điện thoại khớp chính xác tài khoản customer.
 * Điều kiện kép tránh gắn nhầm đơn chỉ vì người khác nhập nhầm một email.
 */
async function resolveOrderUserId(
  authenticatedUserId: string | undefined,
  address: ReturnType<typeof normalizeOrderAddress>,
) {
  if (authenticatedUserId) return authenticatedUserId;
  if (!address.email || !address.phone) return undefined;

  const existingUser: any = await User.findOne({
    role: 'customer',
    email: address.email,
    phone: address.phone,
  })
    .select('_id')
    .lean();

  return existingUser?._id ? String(existingUser._id) : undefined;
}

async function incrementCustomerCounter(
  Model: any,
  query: any,
  field: string,
  amount: number,
  limit: number,
  session?: mongoose.ClientSession,
) {
  const options: any = { new: true, session };
  if (limit <= 0) {
    return Model.findOneAndUpdate(
      query,
      { $inc: { [field]: amount } },
      { ...options, upsert: true, setDefaultsOnInsert: true },
    );
  }
  let item = await Model.findOneAndUpdate(
    { ...query, [field]: { $lte: limit - amount } },
    { $inc: { [field]: amount } },
    options,
  );
  if (item) return item;
  try {
    const docs = await Model.create(
      [{ ...query, [field]: amount }],
      session ? { session } : undefined,
    );
    return docs[0];
  } catch (cause: any) {
    if (cause?.code !== 11000) throw cause;
    item = await Model.findOneAndUpdate(
      { ...query, [field]: { $lte: limit - amount } },
      { $inc: { [field]: amount } },
      options,
    );
    if (item) return item;
    throw Object.assign(new Error('Bạn đã sử dụng hết số lượng ưu đãi cho phép'), { status: 409 });
  }
}

async function reservePromotions(
  quote: PricingQuote,
  customerKey: string,
  session?: mongoose.ClientSession,
) {
  const reservedFlash: Array<{ id: string; quantity: number }> = [];
  let voucherReserved = false;
  try {
    if (quote.voucher) {
      const voucher: any = await Voucher.findById(quote.voucher.id).session(session || null);
      if (!voucher || !voucher.isActive)
        throw Object.assign(new Error('Voucher không còn khả dụng'), { status: 409 });
      const filter: any = { _id: voucher._id, isActive: true };
      if (Number(voucher.usageLimit || 0) > 0)
        filter.usedCount = { $lt: Number(voucher.usageLimit) };
      const result = await Voucher.updateOne(filter, { $inc: { usedCount: 1 } }, { session });
      if (result.modifiedCount !== 1)
        throw Object.assign(new Error('Voucher vừa hết lượt sử dụng'), { status: 409 });
      voucherReserved = true;
      await incrementCustomerCounter(
        VoucherCounter,
        { voucher: voucher._id, customerKey },
        'count',
        1,
        Number(voucher.usageLimitPerUser || 0),
        session,
      );
    }

    for (const item of quote.items) {
      if (!item.flashSaleId) continue;
      const flash: any = await FlashSale.findById(item.flashSaleId).session(session || null);
      if (!flash) throw Object.assign(new Error('Flash sale không còn khả dụng'), { status: 409 });
      const now = new Date();
      const result = await FlashSale.updateOne(
        {
          _id: flash._id,
          isActive: true,
          startTime: { $lte: now },
          endTime: { $gt: now },
          $expr: { $lte: [{ $add: ['$soldCount', item.quantity] }, '$stockAllocated'] },
        },
        { $inc: { soldCount: item.quantity } },
        { session },
      );
      if (result.modifiedCount !== 1)
        throw Object.assign(new Error('Số lượng flash sale vừa hết'), { status: 409 });
      reservedFlash.push({ id: String(flash._id), quantity: item.quantity });
      await incrementCustomerCounter(
        FlashSaleUsage,
        { flashSale: flash._id, customerKey },
        'quantity',
        item.quantity,
        Number(flash.maxPerUser || 0),
        session,
      );
    }
    return { reservedFlash, voucherReserved };
  } catch (cause) {
    // Mongo transaction tu rollback. Fallback khong co transaction nen phai tra lai
    // dung nhung quota da reserve thanh cong truoc khi gap loi.
    if (!session) {
      if (voucherReserved && quote.voucher) {
        await Voucher.updateOne(
          { _id: quote.voucher.id, usedCount: { $gt: 0 } },
          { $inc: { usedCount: -1 } },
        );
        await VoucherCounter.updateOne(
          { voucher: quote.voucher.id, customerKey, count: { $gt: 0 } },
          { $inc: { count: -1 } },
        );
      }
      for (const reserved of reservedFlash) {
        await FlashSale.updateOne(
          { _id: reserved.id, soldCount: { $gte: reserved.quantity } },
          { $inc: { soldCount: -reserved.quantity } },
        );
        await FlashSaleUsage.updateOne(
          { flashSale: reserved.id, customerKey, quantity: { $gte: reserved.quantity } },
          { $inc: { quantity: -reserved.quantity } },
        );
      }
    }
    throw cause;
  }
}

async function releasePromotions(quote: PricingQuote, customerKey: string) {
  if (quote.voucher) {
    await Voucher.updateOne(
      { _id: quote.voucher.id, usedCount: { $gt: 0 } },
      { $inc: { usedCount: -1 } },
    );
    await VoucherCounter.updateOne(
      { voucher: quote.voucher.id, customerKey, count: { $gt: 0 } },
      { $inc: { count: -1 } },
    );
  }
  for (const item of quote.items)
    if (item.flashSaleId) {
      await FlashSale.updateOne(
        { _id: item.flashSaleId, soldCount: { $gte: item.quantity } },
        { $inc: { soldCount: -item.quantity } },
      );
      await FlashSaleUsage.updateOne(
        { flashSale: item.flashSaleId, customerKey, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
      );
    }
}

export async function releaseOrderPromotionReservations(
  order: any,
  session?: mongoose.ClientSession,
) {
  const key = pricingCustomerKey(order.user ? String(order.user) : undefined, order.address?.email);
  if (order.voucherCode) {
    const voucher: any = await Voucher.findOne({ code: order.voucherCode }).session(
      session || null,
    );
    if (voucher) {
      await Voucher.updateOne(
        { _id: voucher._id, usedCount: { $gt: 0 } },
        { $inc: { usedCount: -1 } },
        { session },
      );
      if (key)
        await VoucherCounter.updateOne(
          { voucher: voucher._id, customerKey: key, count: { $gt: 0 } },
          { $inc: { count: -1 } },
          { session },
        );
    }
  }
  for (const item of order.items || []) {
    if (item.promotionType !== 'FLASH_SALE' || !item.promotionId) continue;
    await FlashSale.updateOne(
      { _id: item.promotionId, soldCount: { $gte: item.quantity } },
      { $inc: { soldCount: -Number(item.quantity) } },
      { session },
    );
    if (key)
      await FlashSaleUsage.updateOne(
        { flashSale: item.promotionId, customerKey: key, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -Number(item.quantity) } },
        { session },
      );
  }
}

function transactionUnsupported(error: any) {
  const message = String(error?.message || '');
  return (
    error?.code === 20 ||
    error?.codeName === 'IllegalOperation' ||
    /Transaction numbers|replica set|not support|Transactions are not/i.test(message)
  );
}

/**
 * TAO DON HANG THAT (checkout).
 * Luong: kiem tra ton kho -> tinh tien (voucher/ship/VAT da gom trong gia) -> TRU kho -> tao Order + Payment
 * -> xoa gio. Uu tien dung Mongo transaction; neu DB khong ho tro
 * (khong phai replica set) thi fallback ve co che rollback thu cong.
 */
export async function createOrder(userId: string | undefined, opts: CreateOrderOptions = {}) {
  const cart: any = userId ? await Cart.findOne({ user: userId }) : null;
  const explicitItems = Array.isArray(opts.items) && opts.items.length > 0;

  const stockItems: StockItem[] = explicitItems
    ? (opts.items || []).map((item) => ({
        variant: String(item.variant),
        quantity: Number(item.quantity),
      }))
    : (cart?.items || []).map((i: any) => ({ variant: String(i.variant), quantity: i.quantity }));

  if (!stockItems.length) {
    throw Object.assign(new Error('Gio hang trong'), { status: 400 });
  }

  const address = normalizeOrderAddress(opts.address);
  const orderUserId = await resolveOrderUserId(userId, address);
  const guestOrderToken = userId ? undefined : randomBytes(32).toString('base64url');
  // Server resolve lai tat ca gia tu DB. Khong doc gia/discount do client gui.
  const quote = await quoteOrder(stockItems, {
    voucherCode: opts.voucherCode,
    shippingMethod: opts.shippingMethod,
    userId: orderUserId,
    email: address.email,
  });
  const totals = {
    subtotal: quote.subtotal,
    discount: quote.voucherDiscount,
    shippingFee: quote.shippingFee,
    vatRate: quote.vatRate,
    vatIncluded: quote.vatIncluded,
    pricesIncludeVat: quote.pricesIncludeVat,
    total: quote.finalTotal,
    originalTotal: quote.originalTotal,
    productLevelDiscount: quote.productLevelDiscount,
    voucherDiscount: quote.voucherDiscount,
    shippingDiscount: quote.shippingDiscount,
  };
  const method = opts.method === 'bank_qr' ? 'bank_qr' : 'cod';
  const qrCreatedAt = new Date();
  const paymentExpiresAt = new Date(qrCreatedAt.getTime() + env.qrPayment.ttlMinutes * 60_000);
  const paymentCancellationAt = new Date(
    paymentExpiresAt.getTime() + env.qrPayment.reconciliationGraceMinutes * 60_000,
  );
  const customerKey = pricingCustomerKey(orderUserId, address.email);
  const orderItems = quote.items.map((x) => ({
    variant: x.variant,
    name: x.name,
    volume: x.volume,
    price: x.finalPrice,
    basePrice: x.basePrice,
    finalPrice: x.finalPrice,
    productDiscountAmount: x.discountAmount,
    promotionType: x.promotionType,
    promotionId: x.promotionId || undefined,
    promotionName: x.promotionName,
    costPrice: x.costPrice,
    quantity: x.quantity,
  }));

  const buildDoc = () => ({
    ...(orderUserId ? { user: orderUserId } : {}),
    ...(guestOrderToken ? { guestAccessTokenHash: hashGuestOrderToken(guestOrderToken) } : {}),
    items: orderItems,
    subtotal: totals.subtotal,
    originalTotal: totals.originalTotal,
    productLevelDiscount: totals.productLevelDiscount,
    voucherDiscount: totals.voucherDiscount,
    shippingDiscount: totals.shippingDiscount,
    discount: totals.discount,
    shippingFee: totals.shippingFee,
    vatRate: totals.vatRate,
    vatIncluded: totals.vatIncluded,
    pricesIncludeVat: totals.pricesIncludeVat,
    total: totals.total,
    voucherCode: quote.voucher?.code,
    voucherSnapshot: quote.voucher
      ? {
          code: quote.voucher.code,
          name: quote.voucher.name,
          type: quote.voucher.type,
          value: quote.voucher.value,
          stackable: quote.voucher.stackable,
          userSegment: quote.voucher.userSegment,
        }
      : undefined,
    status: 'pending' as const,
    statusHistory: [{ status: 'pending', at: new Date() }],
    address,
    note: opts.note,
    ...(method === 'bank_qr' ? { paymentExpiresAt, paymentCancellationAt } : {}),
  });

  let created: any = null;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await decrementStockSession(stockItems, session);
      await reservePromotions(quote, customerKey, session);
      const docs = await Order.create([buildDoc()], { session });
      created = docs[0];
      await Payment.create(
        [
          {
            order: created._id,
            method,
            status: 'unpaid',
            amount: totals.total,
            receivedAmount: 0,
            reconciliationStatus: method === 'bank_qr' ? 'awaiting_payment' : undefined,
          },
        ],
        { session },
      );
      if (cart && !explicitItems) {
        cart.items = [];
        await cart.save({ session });
      }
    });
  } catch (txnErr: any) {
    if (!transactionUnsupported(txnErr)) throw txnErr;
    logger.warn('[order] Mongo không hỗ trợ transaction -> dùng fallback rollback thủ công');
    created = await createOrderFallback({
      cart,
      stockItems,
      doc: buildDoc(),
      method,
      totals,
      quote,
      customerKey,
      explicitItems,
    });
  } finally {
    await session.endSession();
  }

  void sendOrderNotification(String(created._id), 'created').catch((error) => {
    logger.error('[order] Gửi email xác nhận đơn hàng thất bại', error);
  });

  return {
    orderId: String(created._id),
    total: totals.total,
    status: created.status,
    method,
    ...(method === 'bank_qr' ? { paymentExpiresAt, paymentCancellationAt } : {}),
    totals,
    ...(guestOrderToken ? { guestOrderToken } : {}),
  };
}

async function createOrderFallback(p: {
  cart: any;
  stockItems: StockItem[];
  doc: any;
  method: 'cod' | 'bank_qr';
  totals: any;
  quote: PricingQuote;
  customerKey: string;
  explicitItems?: boolean;
}) {
  await decrementStock(p.stockItems);
  let promotionsReserved = false;
  let createdOrderId: mongoose.Types.ObjectId | undefined;
  let createdPaymentId: mongoose.Types.ObjectId | undefined;
  try {
    await reservePromotions(p.quote, p.customerKey);
    promotionsReserved = true;
    const order: any = await Order.create(p.doc);
    createdOrderId = order._id;
    const payment: any = await Payment.create({
      order: order._id,
      method: p.method,
      status: 'unpaid',
      amount: p.totals.total,
      receivedAmount: 0,
      reconciliationStatus: p.method === 'bank_qr' ? 'awaiting_payment' : undefined,
    });
    createdPaymentId = payment._id;
    if (p.cart && !p.explicitItems) {
      p.cart.items = [];
      await p.cart.save();
    }
    return order;
  } catch (err) {
    const cleanupResults = await Promise.allSettled([
      createdPaymentId ? Payment.deleteOne({ _id: createdPaymentId }) : Promise.resolve(),
      createdOrderId ? Order.deleteOne({ _id: createdOrderId }) : Promise.resolve(),
      restoreStock(p.stockItems),
      promotionsReserved ? releasePromotions(p.quote, p.customerKey) : Promise.resolve(),
    ]);
    if (cleanupResults.some((result) => result.status === 'rejected')) {
      logger.error('[order] Fallback rollback khong hoan tat', cleanupResults);
    }
    throw err;
  }
}

/** HUY DON cua user: chi cho phep khi don dang pending/paid; hoan kho. */
export async function cancelOrder(userId: string, orderId: string, reason?: string) {
  let order: any = null;
  const cancelledAt = new Date();
  try {
    order = await Order.findOneAndUpdate(
      { _id: orderId, user: userId, status: { $in: ['pending', 'paid'] } },
      {
        $set: {
          status: 'cancelled',
          cancelledBy: 'customer',
          cancelledAt,
          inventoryReleasedAt: cancelledAt,
          ...(reason ? { cancelReason: String(reason).trim().slice(0, 300) } : {}),
        },
        $push: { statusHistory: { status: 'cancelled', at: cancelledAt } },
      },
      { new: false },
    );
  } catch {
    throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  }
  if (!order) throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  await releaseOrderPromotionReservations(order);
  await restoreStock(
    (order.items || []).map((it: any) => ({ variant: String(it.variant), quantity: it.quantity })),
  );
  const cancelPayment: any = await Payment.findOne({ order: order._id });
  if (cancelPayment) {
    // Co bang chung ngan hang da nhan tien -> luon dua vao hang cho hoan tien,
    // ke ca khi admin chua kip bam xac nhan thanh toan.
    if (bankTransferNeedsRefund(cancelPayment)) {
      cancelPayment.status = 'refund_pending';
      cancelPayment.refundStatus = 'pending';
      cancelPayment.refundAmount = Number(
        cancelPayment.receivedAmount || cancelPayment.amount || 0,
      );
      cancelPayment.refundReason = 'order_cancelled';
    } else {
      cancelPayment.status = 'unpaid';
      cancelPayment.paidAt = undefined;
    }
    await cancelPayment.save();
  }
  void sendOrderNotification(String(order._id), 'status').catch(() => null);

  return { orderId: String(order._id), status: 'cancelled' };
}

/** Huy don QR chua thanh toan tu popup checkout, ap dung cho guest va user. */
export async function cancelPendingQrOrder(
  orderId: string,
  userId?: string,
  guestOrderToken?: string,
) {
  let order: any = null;
  const access = orderAccessFilter(userId, orderId, guestOrderToken);
  try {
    order = await Order.findOne(access);
  } catch {
    throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  }
  if (!order) throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });

  const payment: any = await Payment.findOne({ order: order._id });
  if (
    !payment ||
    payment.method !== 'bank_qr' ||
    !['unpaid', 'partial'].includes(payment.status) ||
    order.status !== 'pending'
  ) {
    throw Object.assign(new Error('Chi co the huy giao dich QR chua thanh toan'), { status: 400 });
  }

  const cancelledAt = new Date();
  order = await Order.findOneAndUpdate(
    { ...access, status: 'pending' },
    {
      $set: {
        status: 'cancelled',
        cancelledBy: 'customer',
        cancelledAt,
        inventoryReleasedAt: cancelledAt,
      },
      $push: { statusHistory: { status: 'cancelled', at: cancelledAt } },
    },
    { new: false },
  );
  if (!order) {
    throw Object.assign(new Error('Đơn không còn có thể hủy'), { status: 409 });
  }

  await releaseOrderPromotionReservations(order);
  await restoreStock(
    (order.items || []).map((it: any) => ({ variant: String(it.variant), quantity: it.quantity })),
  );
  if (bankTransferNeedsRefund(payment)) {
    payment.status = 'refund_pending';
    payment.refundStatus = 'pending';
    payment.refundAmount = Number(payment.receivedAmount || payment.amount || 0);
    payment.refundReason = 'order_cancelled';
    await payment.save();
  }
  void sendOrderNotification(String(order._id), 'status').catch(() => null);

  return { orderId: String(order._id), status: 'cancelled' };
}

/** Danh sach don cua 1 user (moi nhat truoc). */
export async function getMyOrders(userId: string) {
  const user: any = await User.findById(userId).select('email phone').lean();
  if (user?.email && user?.phone) {
    await claimGuestOrdersForUser(user, String(user.email), String(user.phone));
  }

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
      status: normalizeOrderStatus(o.status),
      paymentExpiresAt: o.paymentExpiresAt || null,
      paymentCancellationAt: o.paymentCancellationAt || null,
      itemCount,
      firstItemName: o.items?.[0]?.name || '',
      payment: pay
        ? { method: pay.method, status: pay.status }
        : { method: 'cod', status: 'unpaid' },
    };
  });
}

const LOOKUP_OTP_TTL_MS = 60_000;
// Giu challenge 2 gio de bo dem 5 lan/gui trong 1 gio khong bi TTL xoa som.
const LOOKUP_RETENTION_MS = 2 * 60 * 60_000;
const LOOKUP_MAX_ATTEMPTS = 5;
const LOOKUP_SEND_COOLDOWN_MS = 60_000;
const LOOKUP_MAX_SENDS_PER_HOUR = 5;
const LOOKUP_GENERIC_MESSAGE =
  'Nếu email và số điện thoại khớp với thông tin đặt hàng, mã OTP sẽ được gửi đến email của bạn.';

function lookupSecret() {
  return process.env.GUEST_ORDER_LOOKUP_SECRET?.trim() || env.jwtAccessSecret;
}

function hashLookupId(value: string) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function keyedLookupHash(value: string) {
  return createHmac('sha256', lookupSecret()).update(value, 'utf8').digest('hex');
}

function normalizeLookupPhone(value: string) {
  const phone = normalizePhone(value);
  return phone.startsWith('84') && phone.length === 11 ? `0${phone.slice(2)}` : phone;
}

async function findOrdersByVerifiedContact(email: string, phone: string) {
  return Order.find({ 'address.email': email, 'address.phone': phone })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
}

async function presentVerifiedLookupOrders(orders: any[]) {
  if (!orders.length) return [];
  const payments: any[] = await Payment.find({
    order: { $in: orders.map((order) => order._id) },
  }).lean();
  const paymentMap = new Map(payments.map((payment) => [String(payment.order), payment]));

  return orders.map((order) => {
    const payment = paymentMap.get(String(order._id));
    return {
      code: String(order._id).slice(-6).toUpperCase(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      processedAt: order.processedAt || null,
      shippedAt: order.shippedAt || null,
      completedAt: orderCompletedAt(order) || null,
      cancelledAt: order.cancelledAt || null,
      returnedAt: order.returnedAt || null,
      status: normalizeOrderStatus(order.status),
      statusHistory: (order.statusHistory || []).map((event: any) => ({
        status: normalizeOrderStatus(event.status),
        at: event.at,
      })),
      cancelReason: order.cancelReason || '',
      cancelledBy: order.cancelledBy || null,
      itemCount: (order.items || []).reduce(
        (sum: number, item: any) => sum + Number(item.quantity || 0),
        0,
      ),
      items: (order.items || []).map((item: any) => ({
        name: item.name || '',
        volume: item.volume || '',
        price: Number(item.price || 0),
        basePrice: Number(item.basePrice ?? item.price ?? 0),
        finalPrice: Number(item.finalPrice ?? item.price ?? 0),
        productDiscountAmount: Number(item.productDiscountAmount || 0),
        promotionName: item.promotionName || '',
        quantity: Number(item.quantity || 0),
        lineTotal: Number(item.price || 0) * Number(item.quantity || 0),
      })),
      subtotal: Number(order.subtotal ?? order.total ?? 0),
      originalTotal: Number(order.originalTotal ?? order.subtotal ?? order.total ?? 0),
      productLevelDiscount: Number(order.productLevelDiscount || 0),
      voucherDiscount: Number(order.voucherDiscount ?? order.discount ?? 0),
      shippingDiscount: Number(order.shippingDiscount || 0),
      discount: Number(order.discount || 0),
      shippingFee: Number(order.shippingFee || 0),
      vatRate: order.vatRate ?? null,
      vatIncluded: order.vatIncluded ?? null,
      pricesIncludeVat: order.pricesIncludeVat ?? null,
      total: Number(order.total || 0),
      voucherCode: order.voucherCode || '',
      address: order.address || null,
      note: order.note || '',
      payment: payment
        ? {
            method: payment.method,
            status: payment.status,
            amount: Number(payment.amount ?? order.total ?? 0),
            receivedAmount: Number(payment.receivedAmount || 0),
            remainingAmount: Math.max(
              0,
              Number(payment.amount ?? order.total ?? 0) - Number(payment.receivedAmount || 0),
            ),
            paidAt: payment.paidAt || null,
          }
        : {
            method: 'cod',
            status: 'unpaid',
            amount: Number(order.total || 0),
            receivedAmount: 0,
            remainingAmount: Number(order.total || 0),
            paidAt: null,
          },
    };
  });
}

/** Tao challenge tra cuu cho moi cap thong tin hop le ve dinh dang, khong lam lo cap co ton tai. */
export async function requestGuestOrderLookupOtp(inputEmail: string, inputPhone: string) {
  const email = normalizeEmail(inputEmail);
  const phone = normalizeLookupPhone(inputPhone);
  assertValidContact(email, phone);

  const contactKey = keyedLookupHash(`${email}\n${phone}`);
  const now = Date.now();
  const latest: any = await GuestOrderLookup.findOne({ contactKey })
    .sort({ createdAt: -1 })
    .select('createdAt')
    .lean();
  if (latest?.createdAt && now - new Date(latest.createdAt).getTime() < LOOKUP_SEND_COOLDOWN_MS) {
    throw Object.assign(new Error('Vui lòng chờ 1 phút trước khi yêu cầu mã OTP mới.'), {
      status: 429,
    });
  }
  const sentInLastHour = await GuestOrderLookup.countDocuments({
    contactKey,
    createdAt: { $gt: new Date(now - 60 * 60_000) },
  });
  if (sentInLastHour >= LOOKUP_MAX_SENDS_PER_HOUR) {
    throw Object.assign(new Error('Bạn đã yêu cầu quá nhiều mã OTP. Vui lòng thử lại sau.'), {
      status: 429,
    });
  }

  const matched = Boolean(await Order.exists({ 'address.email': email, 'address.phone': phone }));
  const lookupId = randomBytes(32).toString('base64url');
  const otp = randomInt(100000, 1000000).toString();
  const otpExpiresAt = new Date(now + LOOKUP_OTP_TTL_MS);

  await GuestOrderLookup.updateMany(
    { contactKey, consumedAt: { $exists: false } },
    { $set: { consumedAt: new Date(now) } },
  );
  const challenge = await GuestOrderLookup.create({
    lookupIdHash: hashLookupId(lookupId),
    contactKey,
    ...(matched ? { email, phone } : {}),
    otpHash: keyedLookupHash(`${lookupId}\n${otp}`),
    matched,
    attempts: 0,
    otpExpiresAt,
    expiresAt: new Date(now + LOOKUP_RETENTION_MS),
  });

  if (matched) {
    void sendMail({
      to: email,
      subject: `${otp} - Mã OTP tra cứu đơn hàng`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#24211d;line-height:1.6">
          <h2 style="color:#806b3d">Xác minh tra cứu đơn hàng</h2>
          <p>Mã OTP của bạn là:</p>
          <p style="font-size:34px;letter-spacing:8px;font-weight:700;color:#806b3d">${otp}</p>
          <p>Mã chỉ có hiệu lực trong <strong>1 phút</strong> và chỉ được sử dụng một lần.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
        </div>`,
      text: `Mã OTP tra cứu đơn hàng của bạn là ${otp}. Mã có hiệu lực trong 1 phút và chỉ được sử dụng một lần.`,
    }).then(async (sent) => {
      if (!sent) {
        await GuestOrderLookup.updateOne(
          { _id: challenge._id, consumedAt: { $exists: false } },
          { $set: { consumedAt: new Date() } },
        ).catch(() => undefined);
      }
    });
  }

  return { lookupId, message: LOOKUP_GENERIC_MESSAGE, expiresIn: 60 };
}

/** OTP dung chi duoc tieu thu mot lan; moi lan verify hop le ve challenge deu tinh mot attempt. */
export async function verifyGuestOrderLookupOtp(lookupId: string, otp: string) {
  const invalidOtp = () =>
    Object.assign(new Error('Mã OTP không hợp lệ hoặc đã hết hạn.'), { status: 400 });
  const lookupIdHash = hashLookupId(lookupId);
  const challenge: any = await GuestOrderLookup.findOneAndUpdate(
    {
      lookupIdHash,
      consumedAt: { $exists: false },
      otpExpiresAt: { $gt: new Date() },
      attempts: { $lt: LOOKUP_MAX_ATTEMPTS },
    },
    { $inc: { attempts: 1 } },
    { new: true },
  ).select('+otpHash +matched +email +phone');

  if (!challenge?.otpHash) throw invalidOtp();
  const expected = Buffer.from(challenge.otpHash, 'hex');
  const received = Buffer.from(keyedLookupHash(`${lookupId}\n${otp}`), 'hex');
  const matches = expected.length === received.length && timingSafeEqual(expected, received);

  if (!matches || !challenge.matched || !challenge.email || !challenge.phone) {
    if (challenge.attempts >= LOOKUP_MAX_ATTEMPTS) {
      await GuestOrderLookup.updateOne(
        { _id: challenge._id, consumedAt: { $exists: false } },
        { $set: { consumedAt: new Date() } },
      );
    }
    throw invalidOtp();
  }

  const consumed = await GuestOrderLookup.updateOne(
    { _id: challenge._id, consumedAt: { $exists: false } },
    { $set: { consumedAt: new Date() } },
  );
  if (consumed.modifiedCount !== 1) throw invalidOtp();

  const orders = await findOrdersByVerifiedContact(challenge.email, challenge.phone);
  return presentVerifiedLookupOrders(orders);
}

/** Chi tiet 1 don cua user (chan xem don nguoi khac bang dieu kien { _id, user }). */
export async function getOrderById(
  userId: string | undefined,
  orderId: string,
  guestOrderToken?: string,
) {
  let order: any = null;
  const access = orderAccessFilter(userId, orderId, guestOrderToken);
  try {
    order = await Order.findOne(access).lean();
  } catch {
    throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  }
  if (!order) throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });

  const payment: any = await Payment.findOne({ order: order._id }).lean();
  const hasOrderAccess = Boolean(userId || guestOrderToken);
  const existingReturnRequest = hasOrderAccess
    ? await SupportRequest.findOne({ order: order._id, type: 'returns' })
        .select('_id status')
        .lean()
    : null;
  const completedAt = orderCompletedAt(order);
  const eligibleUntil = completedAt
    ? new Date(completedAt.getTime() + STANDARD_RETURN_REQUEST_WINDOW_MS)
    : null;
  const isDelivered = normalizeOrderStatus(String(order.status)) === 'done';
  const isPaidOrder =
    Boolean(payment) &&
    ['cod', 'bank_qr'].includes(String(payment.method)) &&
    payment.status === 'paid';
  const returnSupportEligible = Boolean(
    hasOrderAccess &&
    isDelivered &&
    isPaidOrder &&
    eligibleUntil &&
    Date.now() <= eligibleUntil.getTime() &&
    !existingReturnRequest,
  );

  return {
    id: String(order._id),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    completedAt: completedAt || null,
    status: normalizeOrderStatus(order.status),
    statusHistory: (order.statusHistory || []).map((event: any) => ({
      status: normalizeOrderStatus(event.status),
      at: event.at,
    })),
    // Khach chi tu huy duoc khi don dang cho xu ly / da thanh toan va la chu don (da dang nhap).
    canCancel: Boolean(userId) && ['pending', 'paid'].includes(String(order.status)),
    returnSupport: {
      eligible: returnSupportEligible,
      eligibleUntil,
      requested: Boolean(existingReturnRequest),
      requestStatus: existingReturnRequest?.status || null,
      expired: Boolean(eligibleUntil && Date.now() > eligibleUntil.getTime()),
      reason: !hasOrderAccess
        ? 'access_required'
        : existingReturnRequest
          ? 'already_requested'
          : !isDelivered
            ? 'not_delivered'
            : !isPaidOrder
              ? 'payment_not_completed'
              : !eligibleUntil
                ? 'missing_completion_time'
                : Date.now() > eligibleUntil.getTime()
                  ? 'expired'
                  : null,
    },
    cancelReason: order.cancelReason || '',
    cancelledBy: order.cancelledBy || null,
    cancelledAt: order.cancelledAt || null,
    paymentExpiresAt: order.paymentExpiresAt || null,
    paymentCancellationAt: order.paymentCancellationAt || null,
    subtotal: order.subtotal ?? order.total,
    originalTotal: order.originalTotal ?? order.subtotal ?? order.total,
    productLevelDiscount: order.productLevelDiscount ?? 0,
    voucherDiscount: order.voucherDiscount ?? order.discount ?? 0,
    shippingDiscount: order.shippingDiscount ?? 0,
    discount: order.discount ?? 0,
    shippingFee: order.shippingFee ?? 0,
    vatRate: order.vatRate,
    vatIncluded: order.vatIncluded,
    pricesIncludeVat: order.pricesIncludeVat,
    total: order.total,
    voucherCode: order.voucherCode || '',
    address: order.address || null,
    note: order.note || '',
    items: (order.items || []).map((it: any) => ({
      variant: String(it.variant),
      name: it.name,
      volume: it.volume,
      price: it.price,
      basePrice: it.basePrice ?? it.price,
      finalPrice: it.finalPrice ?? it.price,
      productDiscountAmount: it.productDiscountAmount || 0,
      promotionName: it.promotionName || '',
      quantity: it.quantity,
      lineTotal: (it.price || 0) * (it.quantity || 0),
    })),
    payment: payment
      ? {
          method: payment.method,
          status: payment.status,
          amount: payment.amount,
          receivedAmount: payment.receivedAmount || 0,
          remainingAmount: Math.max(
            0,
            Number(payment.amount || 0) - Number(payment.receivedAmount || 0),
          ),
          excessAmount: payment.excessAmount || 0,
          reconciliationStatus: payment.reconciliationStatus || '',
          refundStatus: payment.refundStatus || 'none',
          refundAmount: payment.refundAmount || 0,
        }
      : null,
  };
}

/** Thong tin thanh toan cho 1 don (COD hoac VietQR). */
export async function getPaymentInfo(
  userId: string | undefined,
  orderId: string,
  guestOrderToken?: string,
) {
  let order: any = null;
  const access = orderAccessFilter(userId, orderId, guestOrderToken);
  try {
    order = await Order.findOne(access).lean();
  } catch {
    throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  }
  if (!order) throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });

  const payment: any = await Payment.findOne({ order: order._id }).lean();
  const method = payment?.method || 'cod';
  const status = payment?.status || 'unpaid';
  const amount = payment?.amount ?? order.total ?? 0;

  const transferContent = 'HOC' + String(order._id).toUpperCase();

  const result = {
    orderId: String(order._id),
    method,
    status,
    amount,
    receivedAmount: Number(payment?.receivedAmount || 0),
    remainingAmount: Math.max(0, Number(amount) - Number(payment?.receivedAmount || 0)),
    excessAmount: Number(payment?.excessAmount || 0),
    reconciliationStatus: payment?.reconciliationStatus || '',
    paymentExpiresAt: order.paymentExpiresAt || null,
    paymentCancellationAt: order.paymentCancellationAt || null,
    bank: {
      bin: env.vietqr.bankBin,
      accountNo: env.vietqr.accountNo,
      accountName: env.vietqr.accountName,
    },
    transferContent,
    qrUrl: '',
  };

  if (method === 'bank_qr') {
    if (!env.vietqr.bankBin || !env.vietqr.accountNo || !env.vietqr.accountName) {
      throw Object.assign(new Error('Chua cau hinh tai khoan VietQR that'), { status: 503 });
    }
    result.qrUrl =
      'https://img.vietqr.io/image/' +
      env.vietqr.bankBin +
      '-' +
      env.vietqr.accountNo +
      '-compact2.png' +
      '?amount=' +
      encodeURIComponent(String(Math.round(amount))) +
      '&addInfo=' +
      encodeURIComponent(transferContent) +
      '&accountName=' +
      encodeURIComponent(env.vietqr.accountName);
  }

  return result;
}
