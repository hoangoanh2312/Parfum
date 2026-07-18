import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, StickyNote, CreditCard } from "lucide-react";
import { api } from "../lib/api";
import Footer from "../components/Footer";
import { StatusBadge, PAY_METHOD, PAY_STATUS } from "./Orders";

const vnd = (n: number) => (n || 0).toLocaleString("vi-VN") + "₫";
const fmtDate = (s: string) =>
  s
    ? new Date(s).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

type Item = {
  variant: string;
  name: string;
  volume: string;
  price: number;
  quantity: number;
  lineTotal: number;
};
type Detail = {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  address: { line?: string; city?: string; phone?: string } | null;
  note: string;
  items: Item[];
  payment: { method: string; status: string; amount: number } | null;
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api
      .get("/orders/" + id)
      .then(({ data }) => {
        if (active) setOrder(data.data);
      })
      .catch((e) => {
        if (active)
          setError(e?.response?.data?.message || "Không tìm thấy đơn hàng");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <section className="max-w-4xl mx-auto px-6 py-12 bg-[#FDF9F4] min-h-[70vh]">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 font-['Manrope'] text-xs uppercase tracking-[2px] text-[#5F5E5E] hover:text-[#735C00] mb-6"
        >
          <ArrowLeft size={14} /> Danh sách đơn hàng
        </Link>

        {loading && (
          <div className="space-y-5" aria-label="Đang tải chi tiết đơn hàng"><div className="h-16 animate-pulse rounded bg-white motion-reduce:animate-none" /><div className="h-64 animate-pulse rounded bg-white motion-reduce:animate-none" /><div className="grid gap-5 md:grid-cols-2"><div className="h-36 animate-pulse rounded bg-white motion-reduce:animate-none" /><div className="h-36 animate-pulse rounded bg-white motion-reduce:animate-none" /></div></div>
        )}
        {!loading && error && (
          <p className="font-['Manrope'] text-red-600">{error}</p>
        )}

        {!loading && order && (
          <>
            <header className="flex items-start justify-between gap-4 flex-wrap mb-8">
              <div>
                <h1 className="font-['Noto_Serif'] text-3xl text-[#1C1C19]">
                  Đơn #{order.id.slice(-6).toUpperCase()}
                </h1>
                <p className="font-['Manrope'] text-sm text-[#5F5E5E] mt-2">
                  Đặt lúc {fmtDate(order.createdAt)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </header>

            {/* Danh sách sản phẩm */}
            <div className="bg-white border border-[rgba(208,197,175,0.4)] divide-y divide-[rgba(208,197,175,0.3)]">
              {order.items.map((it) => (
                <div
                  key={it.variant}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="min-w-0">
                    <h3 className="font-['Noto_Serif'] text-lg text-[#1C1C19] truncate">
                      {it.name}
                    </h3>
                    <p className="font-['Manrope'] uppercase tracking-[1.2px] text-xs text-[#5F5E5E] mt-1">
                      {it.volume} · {vnd(it.price)} x {it.quantity}
                    </p>
                  </div>
                  <span className="font-['Noto_Serif'] text-lg text-[#1C1C19] whitespace-nowrap">
                    {vnd(it.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Tổng tiền */}
            <div className="bg-[#F1EDE8] border border-t-0 border-[rgba(208,197,175,0.4)] p-5 flex justify-between items-center">
              <span className="font-['Noto_Serif'] text-lg text-[#1C1C19]">
                Tổng cộng
              </span>
              <span className="font-['Noto_Serif'] text-2xl text-[#1C1C19]">
                {vnd(order.total)}
              </span>
            </div>

            {/* Thanh toán + địa chỉ + ghi chú */}
            <div className="grid md:grid-cols-2 gap-5 mt-8 font-['Manrope']">
              <div className="bg-white border border-[rgba(208,197,175,0.4)] p-5">
                <div className="flex items-center gap-2 text-[#735C00] mb-3">
                  <CreditCard size={16} />
                  <span className="uppercase text-xs font-bold tracking-[1px]">
                    Thanh toán
                  </span>
                </div>
                {order.payment ? (
                  <div className="text-sm text-[#1C1C19] space-y-1">
                    <p>
                      Phương thức:{" "}
                      {PAY_METHOD[order.payment.method] || order.payment.method}
                    </p>
                    <p>
                      Trạng thái:{" "}
                      {PAY_STATUS[order.payment.status] || order.payment.status}
                    </p>
                    <p>Số tiền: {vnd(order.payment.amount)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-[#5F5E5E]">Chưa có thông tin</p>
                )}
              </div>

              <div className="bg-white border border-[rgba(208,197,175,0.4)] p-5">
                <div className="flex items-center gap-2 text-[#735C00] mb-3">
                  <MapPin size={16} />
                  <span className="uppercase text-xs font-bold tracking-[1px]">
                    Giao tới
                  </span>
                </div>
                {order.address &&
                (order.address.line ||
                  order.address.city ||
                  order.address.phone) ? (
                  <div className="text-sm text-[#1C1C19] space-y-1">
                    {order.address.line && <p>{order.address.line}</p>}
                    {order.address.city && <p>{order.address.city}</p>}
                    {order.address.phone && <p>ĐT: {order.address.phone}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-[#5F5E5E]">Không có địa chỉ</p>
                )}
              </div>
            </div>

            {order.note && (
              <div className="bg-white border border-[rgba(208,197,175,0.4)] p-5 mt-5 font-['Manrope']">
                <div className="flex items-center gap-2 text-[#735C00] mb-2">
                  <StickyNote size={16} />
                  <span className="uppercase text-xs font-bold tracking-[1px]">
                    Ghi chú
                  </span>
                </div>
                <p className="text-sm text-[#1C1C19] whitespace-pre-line">
                  {order.note}
                </p>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
