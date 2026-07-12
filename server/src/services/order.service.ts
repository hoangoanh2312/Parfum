import { Variant } from '../models/variant.model';
import { Cart } from '../models/cart.model';

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
    if (v.stock < qty) {
      problems.push({
        variant: it.variant,
        reason: 'out_of_stock',
        available: v.stock,
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
      available: v.stock,
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
    await Variant.updateOne(
      { _id: it.variant },
      { $inc: { stock: Number(it.quantity) } },
    );
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
