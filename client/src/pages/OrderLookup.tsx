import { FormEvent, useState } from "react";
import { CalendarDays, PackageSearch, Search } from "lucide-react";
import { api } from "../lib/api";
import Footer from "../components/Footer";
import { PAY_METHOD, PAY_STATUS, StatusBadge } from "./Orders";

const vnd = (value: number) => (value || 0).toLocaleString("vi-VN") + "₫";
const formatDate = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

type LookupOrder = {
  id: string;
  code: string;
  createdAt: string;
  status: string;
  total: number;
  itemCount: number;
  items: Array<{ name: string; volume: string; quantity: number }>;
  payment: { method: string; status: string };
};

export default function OrderLookup() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<LookupOrder[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lookup(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/orders/lookup", { params: { q: value } });
      setOrders(Array.isArray(data.data) ? data.data : []);
      setSearched(true);
    } catch (requestError: any) {
      setOrders([]);
      setSearched(true);
      setError(requestError?.response?.data?.message || "Không thể tra cứu đơn hàng lúc này.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-[70vh] bg-[#FDF9F4] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <header className="border-b border-[#DED7CD] pb-9">
            <p className="font-sans text-[10px] uppercase tracking-[3px] text-[#917A28]">
              Đơn hàng
            </p>
            <h1 className="mt-3 font-serif text-4xl text-[#1C1C19] md:text-5xl">
              Tra cứu đơn hàng
            </h1>
          </header>

          <form onSubmit={lookup} className="py-9">
            <label
              htmlFor="order-lookup"
              className="mb-2 block font-sans text-xs uppercase tracking-[1.5px] text-[#5F5E5E]"
            >
              Mã đơn, số điện thoại hoặc email
            </label>
            <div className="flex max-w-3xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <PackageSearch
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9188]"
                />
                <input
                  id="order-lookup"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ví dụ: A1B2C3, 0901234567 hoặc email@vidu.com"
                  autoComplete="off"
                  className="h-[50px] w-full border border-[#D6CEC3] bg-white py-3 pl-12 pr-4 font-sans text-sm text-[#2D2925] outline-none transition-colors focus:border-[#806900]"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="inline-flex h-[50px] items-center justify-center gap-2 bg-[#806900] px-7 font-sans text-xs uppercase tracking-[1.5px] text-white transition-colors hover:bg-[#675500] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Search size={16} />
                {loading ? "Đang tra cứu" : "Tra cứu"}
              </button>
            </div>
          </form>

          {error && (
            <div className="border-l-4 border-[#A45149] bg-[#F7EAE8] px-5 py-4 font-sans text-sm text-[#733832]">
              {error}
            </div>
          )}

          {!error && searched && !loading && orders.length === 0 && (
            <div className="border border-dashed border-[#CEC5B9] py-16 text-center">
              <PackageSearch size={36} className="mx-auto text-[#9A8860]" />
              <p className="mt-4 font-serif text-2xl text-[#2D2925]">Không tìm thấy đơn hàng</p>
            </div>
          )}

          {orders.length > 0 && (
            <section className="space-y-4 pb-12" aria-label="Kết quả tra cứu">
              {orders.map((order) => (
                <article key={order.id} className="border border-[#DED7CD] bg-white p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-serif text-2xl text-[#1C1C19]">Đơn #{order.code}</h2>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-2 flex items-center gap-2 font-sans text-xs text-[#746D65]">
                        <CalendarDays size={14} /> {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <p className="font-serif text-2xl text-[#1C1C19]">{vnd(order.total)}</p>
                  </div>

                  <div className="mt-5 border-t border-[#E9E3DC] pt-4">
                    {order.items.map((item, index) => (
                      <p
                        key={`${item.name}-${index}`}
                        className="font-sans text-sm leading-6 text-[#4F4943]"
                      >
                        {item.name}
                        {item.volume ? ` · ${item.volume}` : ""} · SL {item.quantity}
                      </p>
                    ))}
                    <p className="mt-3 font-sans text-[11px] uppercase tracking-[1px] text-[#806900]">
                      {PAY_METHOD[order.payment.method] || order.payment.method} ·{" "}
                      {PAY_STATUS[order.payment.status] || order.payment.status}
                    </p>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
