import { Variant } from '../models/variant.model';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { env } from '../config/env';

export type StockItem = { variant: string; quantity: number };

/**
 * Kiểm tra tồn kho cho 1 danh sách item.
 * Không thay đổi dữ liệu — chỉ đọc và báo cáo.
 * Trả về: { ok, problems[], items[] (đã tính giá), total }
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
    // Ép kiểu số: thiếu field / null -> coi như 0 (hết hàng), tránh lỗi undefined < qty = false
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
 * TRỪ tồn kho an toàn, chống race condition mà KHÔNG cần transaction:
 * dùng điều kiện { stock: { $gte: qty } } ngay trong updateOne.
 * Nếu 1 item thất bại -> tự HOÀN LẠI (rollback) các item đã trừ trước đó.
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
      await restoreStock(done); // hoàn lại phần đã trừ
      throw Object.assign(new Error('Sản phẩm không đủ tồn kho'), {
        status: 409,
        variant: it.variant,
      });
    }
    done.push({ variant: it.variant, quantity: qty });
  }

  return done;
}

/** HOÀN lại tồn kho (dùng khi hủy đơn hoặc thanh toán thất bại). */
export async function restoreStock(items: StockItem[]) {
  for (const it of items) {
    await Variant.updateOne({ _id: it.variant }, { $inc: { stock: Number(it.quantity) } });
  }
}

/**
 * CHUẨN BỊ CHECKOUT: lấy giỏ hàng của user, kiểm tra tồn kho, tính tổng tiền.
 * KHÔNG tạo đơn ở đây (việc tạo đơn thuộc task API tạo đơn hàng sau này).
 */
export async function prepareCheckout(userId: string) {
  const cart: any = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw Object.assign(new Error('Giỏ hàng trống'), { status: 400 });
  }

  const items: StockItem[] = cart.items.map((i: any) => ({
    variant: String(i.variant),
    quantity: i.quantity,
  }));

  return checkStock(items);
}

/**
 * TẠO ĐƠN HÀNG THẬT (checkout thực sự).
 * Luồng: kiểm tra tồn kho -> TRẪ kho an toàn -> tạo Order (snapshot giá) + Payment -> xóa giỏ.
 * Nếu tạo Order/Payment lỗi -> HOÀN lại kho đã trừ.
 */
export async function createOrder(
  userId: string,
  opts: { method?: 'cod' | 'bank_qr'; address?: any; note?: string } = {},
) {
  const cart: any = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw Object.assign(new Error('Giỏ hàng trống'), { status: 400 });
  }

  const stockItems: StockItem[] = cart.items.map((i: any) => ({
    variant: String(i.variant),
    quantity: i.quantity,
  }));

  // 1) Kiểm tra tồn kho trước khi trừ
  const check = await checkStock(stockItems);
  if (!check.ok) {
    throw Object.assign(new Error('Một số sản phẩm không đủ tồn kho'), {
      status: 409,
      problems: check.problems,
    });
  }

  // 2) TRẪ tồn kho an toàn (tự rollback nếu 1 item lỗi)
  await decrementStock(stockItems);

  try {
    const method = opts.method === 'bank_qr' ? 'bank_qr' : 'cod';

    // 3) Tạo đơn (lưu snapshot tên/giá tại thời điểm mua)
    const order: any = await Order.create({
      user: userId,
      items: check.items.map((x: any) => ({
        variant: x.variant,
        name: x.name,
        volume: x.volume,
        price: x.price,
        quantity: x.quantity,
      })),
      total: check.total,
      status: 'pending',
      address: opts.address,
      note: opts.note,
    });

    // 4) Tạo bản ghi thanh toán (COD mặc định: chưa thanh toán)
    await Payment.create({
      order: order._id,
      method,
      status: 'unpaid',
      amount: check.total,
    });

    // 5) Xóa sạch giỏ sau khi đặt hàng
    cart.items = [];
    await cart.save();

    return {
      orderId: String(order._id),
      total: check.total,
      status: order.status,
      method,
    };
  } catch (err) {
    // Tạo đơn thất bại -> hoàn lại kho đã trừ để không mất tồn kho
    await restoreStock(stockItems);
    throw err;
  }
}

/**
 * PF-35: Lấy DANH SÁCH đơn hàng của 1 user (mới nhất trước).
 * Kèm trạng thái thanh toán (join sang Payment) để hiển thị badge.
 */
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
      payment: pay
        ? { method: pay.method, status: pay.status }
        : { method: 'cod', status: 'unpaid' },
    };
  });
}

/**
 * PF-35: CHI TIẾT 1 đơn hàng của user.
 * Chặn xem đơn của người khác bằng điều kiện { _id, user }.
 */
export async function getOrderById(userId: string, orderId: string) {
  let order: any = null;
  try {
    order = await Order.findOne({ _id: orderId, user: userId }).lean();
  } catch {
    // orderId sai định dạng ObjectId -> coi như không tìm thấy
    throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  }
  if (!order) {
    throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  }

  const payment: any = await Payment.findOne({ order: order._id }).lean();

  return {
    id: String(order._id),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    status: order.status,
    total: order.total,
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
    payment: payment
      ? { method: payment.method, status: payment.status, amount: payment.amount }
      : null,
  };
}

/**
 * PF-36: Thông tin thanh toán cho 1 đơn (COD hoặc chuyển khoản VietQR).
 * Với bank_qr sẽ sinh link ảnh QR động từ cấu hình VietQR trong .env.
 * Chặn xem đơn của người khác bằng điều kiện { _id, user }.
 */
export async function getPaymentInfo(userId: string, orderId: string) {
  let order: any = null;
  try {
    order = await Order.findOne({ _id: orderId, user: userId }).lean();
  } catch {
    throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  }
  if (!order) {
    throw Object.assign(new Error('Không tìm thấy đơn hàng'), { status: 404 });
  }

  const payment: any = await Payment.findOne({ order: order._id }).lean();
  const method = payment?.method || 'cod';
  const status = payment?.status || 'unpaid';
  const amount = payment?.amount ?? order.total ?? 0;

  // Nội dung chuyển khoản: HOCPARFUM + 6 ký tự cuối mã đơn (viết hoa)
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

  // Chỉ tạo ảnh QR khi thanh toán bằng chuyển khoản
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
