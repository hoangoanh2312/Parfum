import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CreditCard,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  StickyNote,
  TicketPercent,
} from "lucide-react";
import Footer from "../components/Footer";
import OrderTimeline, { type OrderStatusEvent } from "../components/OrderTimeline";
import { StatusBadge } from "../components/OrderStatusBadge";
import { api } from "../lib/api";
import { PAY_METHOD, PAY_STATUS } from "../lib/orderPresentation";

const vnd = (value: number) => `${(value || 0).toLocaleString("vi-VN")}₫`;
const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

type LookupOrder = {
  code: string;
  createdAt: string;
  updatedAt?: string;
  processedAt?: string | null;
  shippedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  returnedAt?: string | null;
  status: string;
  statusHistory: OrderStatusEvent[];
  cancelReason?: string;
  cancelledBy?: string | null;
  itemCount: number;
  items: Array<{
    name: string;
    volume: string;
    price: number;
    basePrice: number;
    finalPrice: number;
    productDiscountAmount: number;
    promotionName: string;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  originalTotal: number;
  productLevelDiscount: number;
  voucherDiscount: number;
  shippingDiscount: number;
  discount: number;
  shippingFee: number;
  vatRate: number | null;
  vatIncluded: number | null;
  pricesIncludeVat: boolean | null;
  total: number;
  voucherCode?: string;
  address?: {
    fullName?: string;
    email?: string;
    phone?: string;
    line?: string;
    ward?: string;
    district?: string;
    province?: string;
    city?: string;
  } | null;
  note?: string;
  payment: {
    method: string;
    status: string;
    amount: number;
    receivedAmount: number;
    remainingAmount: number;
    paidAt?: string | null;
  };
};

type Step = "contact" | "otp" | "results";

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#877E74]">{children}</p>
  );
}

export default function OrderLookup() {
  const [step, setStep] = useState<Step>("contact");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [orders, setOrders] = useState<LookupOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(() => setResendIn((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((left, right) => {
        const difference = new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        return sortDirection === "desc" ? difference : -difference;
      }),
    [orders, sortDirection],
  );

  async function requestOtp(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/orders/lookup/request-otp", {
        email: email.trim(),
        phone: phone.trim(),
      });
      setLookupId(data.data.lookupId);
      setNotice(data.data.message);
      setOtp("");
      setResendIn(60);
      setStep("otp");
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Không thể gửi mã OTP lúc này.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP phải gồm đúng 6 chữ số.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/orders/lookup/verify-otp", { lookupId, otp });
      setOrders(Array.isArray(data.data) ? data.data : []);
      setNotice("");
      setStep("results");
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Không thể xác minh OTP lúc này.");
    } finally {
      setLoading(false);
    }
  }

  function resetLookup() {
    setStep("contact");
    setOtp("");
    setLookupId("");
    setOrders([]);
    setNotice("");
    setError("");
    setExpandedOrder(null);
  }

  return (
    <>
      <main className="min-h-[75vh] bg-[#F7F3ED] text-[#201F1B]">
        <section className="border-b border-[#E1D9CD] px-6 pb-14 pt-16 sm:px-10 lg:px-16 lg:pb-20 lg:pt-24">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h1 className="text-[48px] leading-[1.02] tracking-[-0.035em] sm:text-[60px] lg:text-[72px] font-serif italic text-[#7D6719]">
                Tra cứu đơn hàng
              </h1>
              <p className="mt-7 max-w-[560px] text-sm leading-7 text-[#6E6961]">
                Nhập đồng thời email và số điện thoại đã dùng khi đặt hàng. Chúng tôi sẽ gửi mã OTP
                có hiệu lực trong 1 phút đến email nếu thông tin khớp.
              </p>
            </div>
            <div className="grid gap-5 border-l border-[#D8CFC3] pl-0 sm:grid-cols-2 lg:pl-12">
              <div className="flex items-start gap-4">
                <ShieldCheck size={20} className="mt-1 shrink-0 text-[#8C7420]" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">Bảo mật</p>
                  <p className="mt-2 text-xs leading-5 text-[#787169]">
                    Không thể tra cứu chỉ bằng mã đơn, email hoặc số điện thoại riêng lẻ.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <KeyRound size={20} className="mt-1 shrink-0 text-[#8C7420]" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                    OTP 1 phút
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#787169]">
                    Mỗi mã chỉ dùng một lần; mã mới sẽ làm mã cũ mất hiệu lực.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-[1100px]">
            {step !== "results" && (
              <div className="border border-[#DDD4C8] bg-[#FCF9F4] p-6 shadow-[0_20px_55px_rgba(55,45,30,0.06)] sm:p-8 lg:p-10">
                {step === "contact" ? (
                  <form onSubmit={requestOtp} className="space-y-7">
                    <div>
                      <DetailLabel>Thông tin đặt hàng</DetailLabel>
                      <h2 className="mt-2 font-serif text-3xl">Xác minh thông tin của bạn</h2>
                      <p className="mt-3 text-sm leading-6 text-[#777068]">
                        Cả email và số điện thoại phải cùng khớp với thông tin trên đơn hàng.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-xs text-[#655F58]">
                          <Mail size={15} /> Email đặt hàng
                        </span>
                        <input
                          type="email"
                          required
                          maxLength={254}
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          autoComplete="email"
                          placeholder="ten@email.com"
                          className="h-14 w-full border border-[#D8D0C5] bg-white px-4 text-sm outline-none focus:border-[#917A28]"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-xs text-[#655F58]">
                          <Phone size={15} /> Số điện thoại đặt hàng
                        </span>
                        <input
                          type="tel"
                          required
                          minLength={10}
                          maxLength={20}
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          autoComplete="tel"
                          placeholder="0901 234 567"
                          className="h-14 w-full border border-[#D8D0C5] bg-white px-4 text-sm outline-none focus:border-[#917A28]"
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !email.trim() || !phone.trim()}
                      className="inline-flex h-14 items-center justify-center gap-3 bg-[#28251F] px-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8A731A] disabled:opacity-45"
                    >
                      {loading ? "Đang gửi…" : "Gửi mã OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={verifyOtp} className="mx-auto max-w-xl space-y-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D8CCB4] text-[#8F7828]">
                      <KeyRound size={24} />
                    </div>
                    <div>
                      <DetailLabel>Xác minh OTP</DetailLabel>
                      <h2 className="mt-2 font-serif text-3xl">Nhập mã gồm 6 chữ số</h2>
                      <p className="mt-3 text-sm leading-6 text-[#777068]">{notice}</p>
                      <p
                        className={`mt-1 text-xs font-medium ${resendIn > 0 ? "text-[#806900]" : "text-[#9A4138]"}`}
                      >
                        {resendIn > 0
                          ? `Mã còn hiệu lực tối đa ${resendIn} giây.`
                          : "Mã đã hết hạn. Vui lòng yêu cầu mã mới."}
                      </p>
                    </div>
                    <input
                      aria-label="Mã OTP"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="mx-auto block h-16 w-full max-w-xs border border-[#D8D0C5] bg-white px-4 text-center text-2xl tracking-[0.45em] outline-none focus:border-[#917A28]"
                    />
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        type="button"
                        onClick={resetLookup}
                        className="h-12 border border-[#CFC5B9] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#665F57]"
                      >
                        Đổi thông tin
                      </button>
                      <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="h-12 bg-[#28251F] px-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-white disabled:opacity-45"
                      >
                        {loading ? "Đang xác minh…" : "Xác minh và xem đơn"}
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={loading || resendIn > 0}
                      onClick={() => void requestOtp()}
                      className="text-xs text-[#79651D] underline underline-offset-4 disabled:text-[#989088] disabled:no-underline"
                    >
                      {resendIn > 0 ? `Gửi lại OTP sau ${resendIn} giây` : "Gửi lại OTP"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {error && (
              <div className="mt-7 border border-[#D8B9B5] bg-[#F8ECEA] px-6 py-5 text-sm text-[#743E38]">
                {error}
              </div>
            )}

            {step === "results" && (
              <section className="space-y-6 pb-14" aria-label="Kết quả tra cứu">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DCD3C7] pb-5">
                  <div>
                    <DetailLabel>Kết quả đã xác minh</DetailLabel>
                    <h2 className="mt-2 font-serif text-3xl">Đơn hàng của bạn</h2>
                    <p className="mt-2 text-xs text-[#817A72]">Tìm thấy {orders.length} đơn hàng</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {orders.length > 1 && (
                      <select
                        value={sortDirection}
                        onChange={(event) => setSortDirection(event.target.value as "desc" | "asc")}
                        className="border border-[#D8D0C5] bg-[#FCF9F4] px-3 py-2 text-xs"
                        aria-label="Sắp xếp đơn hàng"
                      >
                        <option value="desc">Mới nhất trước</option>
                        <option value="asc">Cũ nhất trước</option>
                      </select>
                    )}
                    <button
                      type="button"
                      onClick={resetLookup}
                      className="border border-[#8B7420] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#675711]"
                    >
                      Tra cứu lại
                    </button>
                  </div>
                </div>

                {sortedOrders.map((order) => {
                  const addressLine = [
                    order.address?.line,
                    order.address?.ward,
                    order.address?.district,
                    order.address?.province || order.address?.city,
                  ]
                    .filter(Boolean)
                    .join(", ");
                  const expanded = expandedOrder === order.code;
                  return (
                    <article
                      key={order.code}
                      className="overflow-hidden border border-[#DDD4C8] bg-[#FCF9F4]"
                    >
                      <div className="grid lg:grid-cols-[1fr_260px]">
                        <div className="p-6 sm:p-8">
                          <div className="flex flex-wrap items-start justify-between gap-5">
                            <div>
                              <DetailLabel>Mã đơn hàng</DetailLabel>
                              <div className="mt-2 flex items-center gap-3">
                                <h3 className="font-serif text-[28px]">#{order.code}</h3>
                                <StatusBadge status={order.status} />
                              </div>
                              <p className="mt-3 flex items-center gap-2 text-xs text-[#777068]">
                                <CalendarDays size={14} /> Đặt lúc {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="sm:text-right">
                              <DetailLabel>Tổng thanh toán</DetailLabel>
                              <p className="mt-2 font-serif text-[28px]">{vnd(order.total)}</p>
                            </div>
                          </div>
                          <div className="mt-7 border-t border-[#E5DED5] pt-6">
                            <DetailLabel>Tiến trình đơn hàng</DetailLabel>
                            <div className="mt-5">
                              <OrderTimeline
                                status={order.status}
                                history={order.statusHistory}
                                compact
                              />
                            </div>
                          </div>

                          {expanded && (
                            <div className="mt-7 space-y-7 border-t border-[#E5DED5] pt-7">
                              <section>
                                <div className="mb-4 flex items-center gap-2 text-[#735C00]">
                                  <ShoppingBag size={16} />
                                  <DetailLabel>Sản phẩm đã đặt</DetailLabel>
                                </div>
                                <div className="divide-y divide-[#E8E1D8] border-y border-[#E8E1D8]">
                                  {order.items.map((item, index) => (
                                    <div
                                      key={`${item.name}-${index}`}
                                      className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]"
                                    >
                                      <div>
                                        <p className="font-serif text-lg">{item.name}</p>
                                        <p className="mt-1 text-xs text-[#817970]">
                                          {item.volume || "Phân loại tiêu chuẩn"} ·{" "}
                                          {item.basePrice > item.price && (
                                            <span className="mr-1 line-through opacity-60">
                                              {vnd(item.basePrice)}
                                            </span>
                                          )}
                                          {vnd(item.price)} × {item.quantity}
                                        </p>
                                        {item.promotionName && (
                                          <p className="mt-1 text-xs text-[#806900]">
                                            Ưu đãi: {item.promotionName}
                                          </p>
                                        )}
                                      </div>
                                      <p className="font-medium">{vnd(item.lineTotal)}</p>
                                    </div>
                                  ))}
                                </div>
                              </section>

                              <div className="grid gap-5 md:grid-cols-2">
                                <section className="border border-[#DED6CC] bg-white p-5">
                                  <div className="mb-4 flex items-center gap-2 text-[#735C00]">
                                    <MapPin size={16} />{" "}
                                    <DetailLabel>Thông tin giao nhận</DetailLabel>
                                  </div>
                                  <div className="space-y-1.5 text-sm text-[#4E4842]">
                                    <p className="font-semibold">
                                      {order.address?.fullName || "Người nhận"}
                                    </p>
                                    {order.address?.phone && (
                                      <p>Điện thoại: {order.address.phone}</p>
                                    )}
                                    {order.address?.email && (
                                      <p className="break-all">Email: {order.address.email}</p>
                                    )}
                                    <p>{addressLine || "Chưa có địa chỉ giao hàng"}</p>
                                  </div>
                                </section>
                                <section className="border border-[#DED6CC] bg-white p-5">
                                  <div className="mb-4 flex items-center gap-2 text-[#735C00]">
                                    <CreditCard size={16} /> <DetailLabel>Thanh toán</DetailLabel>
                                  </div>
                                  <div className="space-y-1.5 text-sm text-[#4E4842]">
                                    <p>
                                      {PAY_METHOD[order.payment.method] || order.payment.method}
                                    </p>
                                    <p>
                                      {PAY_STATUS[order.payment.status] || order.payment.status}
                                    </p>
                                    <p>Số tiền: {vnd(order.payment.amount)}</p>
                                    {order.payment.receivedAmount > 0 && (
                                      <p>Đã nhận: {vnd(order.payment.receivedAmount)}</p>
                                    )}
                                    {order.payment.remainingAmount > 0 && (
                                      <p>Còn thiếu: {vnd(order.payment.remainingAmount)}</p>
                                    )}
                                    {order.payment.paidAt && (
                                      <p>Thanh toán lúc: {formatDate(order.payment.paidAt)}</p>
                                    )}
                                  </div>
                                </section>
                              </div>

                              <section className="border border-[#DED6CC] bg-[#F3EFE8] p-5">
                                <div className="mb-4 flex items-center gap-2 text-[#735C00]">
                                  <TicketPercent size={16} />{" "}
                                  <DetailLabel>Chi tiết thành tiền</DetailLabel>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Tạm tính</span>
                                    <span>{vnd(order.subtotal)}</span>
                                  </div>
                                  {order.originalTotal > order.subtotal && (
                                    <div className="flex justify-between text-[#777068]">
                                      <span>Giá gốc sản phẩm</span>
                                      <span>{vnd(order.originalTotal)}</span>
                                    </div>
                                  )}
                                  {order.productLevelDiscount > 0 && (
                                    <div className="flex justify-between text-[#79651D]">
                                      <span>Giảm giá sản phẩm</span>
                                      <span>-{vnd(order.productLevelDiscount)}</span>
                                    </div>
                                  )}
                                  {order.voucherDiscount > 0 && (
                                    <div className="flex justify-between text-[#79651D]">
                                      <span>
                                        Voucher {order.voucherCode ? `(${order.voucherCode})` : ""}
                                      </span>
                                      <span>-{vnd(order.voucherDiscount)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span>Phí giao hàng</span>
                                    <span>{vnd(order.shippingFee)}</span>
                                  </div>
                                  {order.shippingDiscount > 0 && (
                                    <div className="flex justify-between text-[#79651D]">
                                      <span>Giảm phí giao hàng</span>
                                      <span>-{vnd(order.shippingDiscount)}</span>
                                    </div>
                                  )}
                                  {order.vatIncluded != null && order.vatIncluded > 0 && (
                                    <div className="flex justify-between text-[#777068]">
                                      <span>
                                        VAT đã gồm
                                        {order.vatRate != null
                                          ? ` (${Math.round(order.vatRate * 100)}%)`
                                          : ""}
                                      </span>
                                      <span>{vnd(order.vatIncluded)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between border-t border-[#D8D0C5] pt-3 font-serif text-xl">
                                    <span>Tổng cộng</span>
                                    <span>{vnd(order.total)}</span>
                                  </div>
                                </div>
                              </section>

                              {(order.note || order.cancelReason) && (
                                <section className="border border-[#DED6CC] bg-white p-5">
                                  <div className="mb-3 flex items-center gap-2 text-[#735C00]">
                                    <StickyNote size={16} />{" "}
                                    <DetailLabel>Ghi chú đơn hàng</DetailLabel>
                                  </div>
                                  {order.note && (
                                    <p className="whitespace-pre-line text-sm">{order.note}</p>
                                  )}
                                  {order.cancelReason && (
                                    <p className="mt-2 text-sm text-[#8A3B30]">
                                      Lý do hủy: {order.cancelReason}
                                    </p>
                                  )}
                                </section>
                              )}

                              <p className="text-xs text-[#817A72]">
                                Cập nhật gần nhất: {formatDate(order.updatedAt)}
                              </p>
                            </div>
                          )}
                        </div>

                        <aside className="border-t border-[#DDD4C8] bg-[#F2EEE8] p-6 lg:border-l lg:border-t-0 lg:p-8">
                          <DetailLabel>Thanh toán</DetailLabel>
                          <div className="mt-5 space-y-4 text-sm">
                            <p>{PAY_METHOD[order.payment.method] || order.payment.method}</p>
                            <p className="text-[#806900]">
                              {PAY_STATUS[order.payment.status] || order.payment.status}
                            </p>
                            <p className="border-t border-[#DCD3C8] pt-4 text-xs text-[#817A72]">
                              {order.itemCount} sản phẩm trong đơn hàng
                            </p>
                            <button
                              type="button"
                              aria-expanded={expanded}
                              onClick={() => setExpandedOrder(expanded ? null : order.code)}
                              className="flex w-full items-center justify-center gap-2 border border-[#8B7420] px-3 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#675711] hover:bg-[#8B7420] hover:text-white"
                            >
                              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              {expanded ? "Thu gọn" : "Xem chi tiết đơn hàng"}
                            </button>
                          </div>
                        </aside>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
