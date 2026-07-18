import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Search, X } from 'lucide-react';
import {
  confirmAdminOrderPayment,
  getAdminOrder,
  getAdminOrders,
  patchAdminOrderStatus,
} from '../../lib/admin-order.api';
import { toast } from '../../store/toast.store';
import type {
  AdminOrderDetail,
  AdminOrderListData,
  OrderStatus,
  PaymentStatus,
} from '../../types/admin-order';

const ORDER_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xử lý',
  paid: 'Đã thanh toán',
  shipping: 'Đang giao',
  done: 'Hoàn thành',
  cancelled: 'Đã hủy',
};
const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
};
const METHOD_LABELS = { cod: 'COD', bank_qr: 'Chuyển khoản QR' } as const;
const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['shipping', 'cancelled'],
  shipping: ['done'],
  done: [],
  cancelled: [],
};
const EMPTY_DATA: AdminOrderListData = {
  items: [],
  pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 0 },
};

const money = (value: number) => `${(value || 0).toLocaleString('vi-VN')}₫`;
const dateTime = (value: string) =>
  new Date(value).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
const shortId = (id: string) => `#${id.slice(-6).toUpperCase()}`;
const errorMessage = (error: any, fallback: string) => error?.response?.data?.message || fallback;

function OrderBadge({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    pending: 'border-[#FEDF89] bg-[#FFF7E6] text-[#B54708]',
    paid: 'border-[#B2DDFF] bg-[#EFF8FF] text-[#175CD3]',
    shipping: 'border-[#D9D6FE] bg-[#F4F3FF] text-[#5925DC]',
    done: 'border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]',
    cancelled: 'border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]',
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[status]}`}>{ORDER_LABELS[status]}</span>;
}

function PaymentBadge({ status }: { status?: PaymentStatus }) {
  if (!status) return <span className="text-xs text-[#667085]">Chưa có dữ liệu</span>;
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${status === 'paid' ? 'border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]' : 'border-[#FEDF89] bg-[#FFF7E6] text-[#B54708]'}`}>{PAYMENT_LABELS[status]}</span>;
}

export default function AdminOrders() {
  const [data, setData] = useState(EMPTY_DATA);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | ''>('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getAdminOrders({
        page, limit: 10, search: search || undefined, status: status || undefined,
        paymentStatus: paymentStatus || undefined, sort,
      }));
    } catch (requestError) {
      setError(errorMessage(requestError, 'Không thể tải danh sách đơn hàng'));
    } finally { setLoading(false); }
  }, [page, paymentStatus, search, sort, status]);

  useEffect(() => { void loadOrders(); }, [loadOrders]);

  const loadDetail = useCallback(async (orderId: string) => {
    setDetailLoading(true);
    setDetailError('');
    try { setDetail(await getAdminOrder(orderId)); }
    catch (requestError) { setDetailError(errorMessage(requestError, 'Không thể tải chi tiết đơn hàng')); }
    finally { setDetailLoading(false); }
  }, []);

  function openDetail(orderId: string) {
    setSelectedId(orderId); setDetail(null); setNextStatus(''); void loadDetail(orderId);
  }
  function submitSearch(event: FormEvent) {
    event.preventDefault(); setPage(1); setSearch(searchInput.trim());
  }
  async function updateStatus(next: OrderStatus) {
    if (!detail || actionLoading || !window.confirm(`Xác nhận chuyển đơn hàng sang “${ORDER_LABELS[next]}”?`)) return;
    setActionLoading(true);
    try {
      const response = await patchAdminOrderStatus(detail.id, next);
      setDetail(response.data); setNextStatus(''); toast.success(response.message || 'Đã cập nhật trạng thái đơn hàng');
      await loadOrders();
    } catch (requestError) { toast.error(errorMessage(requestError, 'Không thể cập nhật trạng thái')); }
    finally { setActionLoading(false); }
  }
  async function confirmPayment() {
    if (!detail || actionLoading || !window.confirm('Bạn có chắc muốn xác nhận đơn hàng này đã thanh toán?')) return;
    setActionLoading(true);
    try {
      const response = await confirmAdminOrderPayment(detail.id);
      setDetail(response.data); toast.success(response.message || 'Đã xác nhận thanh toán đơn hàng');
      await loadOrders();
    } catch (requestError) { toast.error(errorMessage(requestError, 'Không thể xác nhận thanh toán')); }
    finally { setActionLoading(false); }
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <h1 className="text-2xl font-bold text-[#182033] sm:text-3xl">Quản lý đơn hàng</h1>
      <p className="mt-1 text-sm text-[#667085] sm:text-base">Theo dõi tiến trình và trạng thái thanh toán.</p>

      <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)] sm:p-5">
        <form onSubmit={submitSearch} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
            <label className="relative min-w-0">
              <span className="sr-only">Tìm kiếm đơn hàng</span>
              <Search className="absolute left-3 top-3 text-[#98A2B3]" size={18} />
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Mã đơn, tên, email, SĐT" className="w-full rounded-lg border border-[#D0D5DD] py-2.5 pl-10 pr-3 text-sm text-[#182033] outline-none placeholder:text-[#98A2B3] focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20" />
            </label>
            <button className="w-full rounded-lg bg-[#172033] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#27344A] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] focus:ring-offset-2 sm:w-[140px]">Tìm kiếm</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <select value={status} onChange={(e) => { setStatus(e.target.value as OrderStatus | ''); setPage(1); }} className="min-w-0 rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#344054] outline-none focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20">
              <option value="">Tất cả trạng thái đơn</option>
              {Object.entries(ORDER_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value as PaymentStatus | ''); setPage(1); }} className="min-w-0 rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#344054] outline-none focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20">
              <option value="">Tất cả thanh toán</option>
              {Object.entries(PAYMENT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select value={sort} onChange={(e) => { setSort(e.target.value as 'newest' | 'oldest'); setPage(1); }} className="min-w-0 rounded-lg border border-[#D0D5DD] px-3 py-2.5 text-sm text-[#344054] outline-none focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20 sm:col-span-2 lg:col-span-1">
              <option value="newest">Mới nhất</option><option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </form>
      </div>

      {loading && <div className="mt-5 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)]"><div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-[#F2F4F7]" />)}</div><p className="mt-4 text-center text-sm text-[#667085]">Đang tải danh sách đơn hàng…</p></div>}
      {!loading && error && <div className="mt-5 rounded-xl border border-[#FECACA] bg-[#FFF1F1] p-6 text-center"><p className="text-[#D92D20]">{error}</p><button onClick={() => void loadOrders()} className="mt-4 rounded-lg border border-[#FECACA] bg-white px-5 py-2 text-sm font-semibold text-[#D92D20] transition-colors hover:bg-[#FEE2E2] focus:outline-none focus:ring-2 focus:ring-[#C6A15B]">Thử lại</button></div>}
      {!loading && !error && data.items.length === 0 && <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-white p-10 text-center shadow-[0_1px_3px_rgba(16,24,40,0.08)] sm:p-14"><Package className="mx-auto text-[#98A2B3]" size={40} /><h2 className="mt-3 text-lg font-semibold text-[#182033]">{search || status || paymentStatus ? 'Không tìm thấy đơn hàng phù hợp' : 'Chưa có đơn hàng'}</h2><p className="mt-1 text-sm text-[#667085]">{search || status || paymentStatus ? 'Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.' : 'Các đơn hàng mới sẽ xuất hiện tại đây.'}</p></div>}

      {!loading && !error && data.items.length > 0 && <>
        <div className="mt-5 hidden overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.08)] md:block">
          <table className="w-full min-w-[900px] table-fixed text-left text-sm text-[#182033]"><thead className="bg-[#F9FAFB] text-xs uppercase tracking-wide text-[#475467]"><tr><th className="w-[12%] px-3 py-3 xl:px-4">Mã đơn</th><th className="w-[20%] px-3 py-3 xl:px-4">Khách hàng</th><th className="w-[14%] px-3 py-3 xl:px-4">Ngày đặt</th><th className="w-[13%] px-3 py-3 text-right xl:px-4">Tổng tiền</th><th className="w-[15%] px-3 py-3 xl:px-4">Trạng thái đơn</th><th className="w-[16%] px-3 py-3 xl:px-4">Thanh toán</th><th className="w-[10%] px-3 py-3 text-right xl:px-4">Thao tác</th></tr></thead>
            <tbody className="divide-y divide-[#EAECF0]">{data.items.map((order) => <tr key={order.id} className="transition-colors hover:bg-[#FAFAF7]"><td className="px-3 py-4 font-semibold text-[#344054] xl:px-4">{shortId(order.id)}</td><td className="px-3 py-4 xl:px-4"><p className="truncate font-medium">{order.customer?.name || 'Không có thông tin'}</p><p className="truncate text-xs text-[#667085]">{order.customer?.email}</p></td><td className="px-3 py-4 text-xs text-[#667085] xl:px-4">{dateTime(order.createdAt)}</td><td className="px-3 py-4 text-right font-bold text-[#182033] xl:px-4">{money(order.total)}</td><td className="px-3 py-4 xl:px-4"><OrderBadge status={order.status} /></td><td className="px-3 py-4 xl:px-4"><PaymentBadge status={order.payment?.status} /><p className="mt-1 truncate text-xs text-[#667085]">{order.payment ? METHOD_LABELS[order.payment.method] : ''}</p></td><td className="px-3 py-4 text-right xl:px-4"><button onClick={() => openDetail(order.id)} className="rounded-lg border border-[#D0D5DD] bg-white px-2.5 py-2 text-xs font-semibold text-[#344054] transition-colors hover:bg-[#F2F4F7] focus:outline-none focus:ring-2 focus:ring-[#C6A15B]">Xem chi tiết</button></td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:hidden">{data.items.map((order) => <article key={order.id} className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-4 text-[#182033] shadow-[0_1px_3px_rgba(16,24,40,0.08)]"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-bold text-[#344054]">{shortId(order.id)}</span><OrderBadge status={order.status} /></div><p className="mt-3 truncate font-medium">{order.customer?.name || 'Không có thông tin khách hàng'}</p><p className="truncate text-xs text-[#667085]">{order.customer?.email}</p><p className="mt-2 text-xs text-[#667085]">{dateTime(order.createdAt)}</p><div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-[#EAECF0] pt-3"><div><PaymentBadge status={order.payment?.status} /><p className="mt-1 text-xs text-[#667085]">{order.payment ? METHOD_LABELS[order.payment.method] : ''}</p></div><strong className="text-right text-[#182033]">{money(order.total)}</strong></div><button onClick={() => openDetail(order.id)} className="mt-4 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-semibold text-[#344054] transition-colors hover:bg-[#F2F4F7] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] sm:w-auto">Xem chi tiết</button></article>)}</div>
        <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)] sm:flex-row"><p className="text-sm text-[#667085]">{data.pagination.totalItems} đơn hàng · Trang {data.pagination.page}/{Math.max(data.pagination.totalPages, 1)}</p><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-[#D0D5DD] bg-white p-2 text-[#344054] transition-colors hover:bg-[#F2F4F7] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Trang trước"><ChevronLeft size={18} /></button><button disabled={page >= data.pagination.totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-[#D0D5DD] bg-white p-2 text-[#344054] transition-colors hover:bg-[#F2F4F7] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Trang sau"><ChevronRight size={18} /></button></div></div>
      </>}

      {selectedId && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.5)] p-2 sm:p-5" role="dialog" aria-modal="true" aria-label="Chi tiết đơn hàng"><div className="max-h-[calc(100vh-1rem)] w-full max-w-[850px] overflow-y-auto overflow-x-hidden rounded-xl border border-[#E5E7EB] bg-[#F7F7F5] text-[#182033] shadow-[0_24px_48px_rgba(16,24,40,0.2)] sm:max-h-[90vh] sm:rounded-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EAECF0] bg-[#FAFAF7] px-4 py-3 sm:px-5 sm:py-4"><h2 className="pr-3 text-lg font-bold text-[#182033] sm:text-xl">Chi tiết đơn hàng {detail ? shortId(detail.id) : ''}</h2><button onClick={() => setSelectedId(null)} disabled={actionLoading} className="shrink-0 rounded-lg border border-[#D0D5DD] bg-white p-2 text-[#344054] transition-colors hover:bg-[#F2F4F7] focus:outline-none focus:ring-2 focus:ring-[#C6A15B]" aria-label="Đóng"><X size={22} /></button></div>
        {detailLoading && <div className="p-16 text-center text-[#667085]">Đang tải chi tiết…</div>}
        {!detailLoading && detailError && <div className="p-10 text-center"><p className="text-[#D92D20]">{detailError}</p><button onClick={() => void loadDetail(selectedId)} className="mt-4 rounded-lg border border-[#FECACA] bg-[#FFF1F1] px-5 py-2 font-semibold text-[#D92D20] hover:bg-[#FEE2E2] focus:outline-none focus:ring-2 focus:ring-[#C6A15B]">Thử lại</button></div>}
        {!detailLoading && detail && <div className="space-y-5 p-4 sm:p-6"><div className="grid gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs uppercase text-[#667085]">Khách hàng</p><p className="mt-1 font-semibold text-[#182033]">{detail.customer?.name || 'Không có thông tin'}</p><p className="text-sm text-[#667085]">{detail.customer?.email}</p></div><div><p className="text-xs uppercase text-[#667085]">Ngày tạo</p><p className="mt-1 text-sm">{dateTime(detail.createdAt)}</p></div><div><p className="text-xs uppercase text-[#667085]">Trạng thái đơn</p><div className="mt-2"><OrderBadge status={detail.status} /></div></div><div><p className="text-xs uppercase text-[#667085]">Thanh toán</p><div className="mt-2"><PaymentBadge status={detail.payment?.status} /></div><p className="mt-1 text-xs text-[#667085]">{detail.payment ? METHOD_LABELS[detail.payment.method] : 'Chưa có Payment'}</p></div></div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5"><h3 className="font-bold text-[#182033]">Sản phẩm</h3><div className="mt-3 divide-y divide-[#EAECF0]">{detail.items.map((item) => <div key={item.variant} className="flex items-start justify-between gap-3 py-4"><div className="min-w-0"><p className="break-words font-medium">{item.name || 'Sản phẩm'}</p><p className="break-all text-sm text-[#667085]">Biến thể: {item.volume || item.variant}</p><p className="text-sm text-[#667085]">{money(item.price)} × {item.quantity}</p></div><strong className="shrink-0 whitespace-nowrap text-[#182033]">{money(item.lineTotal)}</strong></div>)}</div><div className="flex justify-between border-t border-[#EAECF0] pt-4 text-lg"><span>Tổng cộng</span><strong className="text-[#182033]">{money(detail.total)}</strong></div></div>
          <div className="grid gap-5 md:grid-cols-2"><div className="rounded-xl border border-[#E5E7EB] bg-white p-5"><h3 className="font-bold text-[#182033]">Địa chỉ giao hàng</h3>{detail.address ? <div className="mt-3 space-y-1 text-sm text-[#344054]"><p>{detail.address.line}</p><p>{detail.address.city}</p><p>{detail.address.phone}</p></div> : <p className="mt-3 text-sm text-[#667085]">Không có địa chỉ giao hàng</p>}{detail.note && <><h4 className="mt-4 text-sm font-semibold text-[#182033]">Ghi chú</h4><p className="mt-1 break-words whitespace-pre-line text-sm text-[#667085]">{detail.note}</p></>}</div><div className="rounded-xl border border-[#E5E7EB] bg-white p-5"><h3 className="font-bold text-[#182033]">Cập nhật trạng thái</h3><div className="mt-4 rounded-lg bg-[#F9FAFB] p-3"><label className="block text-sm font-medium text-[#667085]">Trạng thái đơn hàng</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><select disabled={actionLoading || NEXT_STATUS[detail.status].length === 0} value={nextStatus} onChange={(e) => setNextStatus(e.target.value as OrderStatus | '')} className="min-w-0 flex-1 rounded-lg border border-[#D0D5DD] bg-white px-3 py-2.5 text-[#344054] outline-none focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/20 disabled:bg-[#F2F4F7]"><option value="">{NEXT_STATUS[detail.status].length ? 'Chọn trạng thái mới' : 'Không còn trạng thái tiếp theo'}</option>{NEXT_STATUS[detail.status].map((next) => <option key={next} value={next}>{ORDER_LABELS[next]}</option>)}</select><button type="button" disabled={actionLoading || !nextStatus} onClick={() => { if (nextStatus) void updateStatus(nextStatus); }} className="rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#27344A] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] disabled:cursor-not-allowed disabled:opacity-40">Xác nhận</button></div></div><div className="mt-4 border-t border-[#EAECF0] pt-4"><p className="text-sm font-medium text-[#667085]">Thanh toán</p>{detail.payment?.status === 'unpaid' ? <button disabled={actionLoading} onClick={() => void confirmPayment()} className="mt-2 rounded-lg bg-[#A67C32] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8C6828] focus:outline-none focus:ring-2 focus:ring-[#C6A15B] disabled:opacity-50">{actionLoading ? 'Đang xử lý…' : 'Xác nhận đã thanh toán'}</button> : <p className="mt-2 rounded-lg border border-[#ABEFC6] bg-[#ECFDF3] p-3 text-sm text-[#027A48]">{detail.payment?.status === 'paid' ? 'Đơn hàng đã được xác nhận thanh toán.' : 'Đơn hàng chưa có thông tin Payment.'}</p>}</div></div></div>
        </div>}</div></div>}
    </div>
  );
}
