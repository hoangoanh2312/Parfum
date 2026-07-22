import { useEffect, useState } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { api } from "../../lib/api";

const vnd = (value: number) => `${(value || 0).toLocaleString("vi-VN")}đ`;

type Order = {
  id: string;
  createdAt?: string;
  status: string;
  displayStatus?: string;
  payment?: {
    method: "cod" | "bank_qr";
    status: "unpaid" | "paid";
    paidAt?: string | null;
  } | null;
  total: number;
  itemCount: number;
  firstItemName: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    lineTotal: number;
  }>;
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get<Order[]>("/account/orders")
      .then(({ data }) => {
        if (mounted) setOrders(data);
      })
      .catch(() => {
        if (mounted) setOrders([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#2D2925]">
      <section className="border-b border-[#E7E0D7] px-6 pb-7 pt-12 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9B9288]">
          Personal Portal
        </p>

        <h1 className="mt-2 font-serif text-4xl lg:text-5xl">Order History</h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7C746C]">
          Lịch sử đơn hàng và trạng thái mua sắm được lấy trực tiếp từ MongoDB.
        </p>
      </section>

      <main className="px-6 py-10 lg:px-12">
        {loading ? (
          <p className="text-sm text-[#7C746C]">Đang tải đơn hàng...</p>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center border border-[#E2DBD2] bg-[#FFFDF9] text-center">
            <ShoppingBag size={38} className="text-[#8B7200]" />
            <h2 className="mt-5 font-serif text-3xl">Chưa có đơn hàng</h2>
            <p className="mt-2 max-w-md text-sm text-[#7C746C]">
              Khi bạn đặt hàng thành công, đơn hàng sẽ xuất hiện ở đây.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="border border-[#E2DBD2] bg-[#FFFDF9] p-6"
              >
                <div className="flex flex-col justify-between gap-4 border-b border-[#EAE4DC] pb-5 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center bg-[#F0ECE7]">
                      <Package size={18} strokeWidth={1.4} />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl">
                        Đơn hàng #{order.id.slice(-6).toUpperCase()}
                      </h2>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#8A8178]">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                            )
                          : "Đang cập nhật"}
                        {" · "}
                        {order.itemCount} sản phẩm
                      </p>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="font-serif text-xl">{vnd(order.total)}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-widest text-[#8B7200]">
                      {order.displayStatus || order.status}
                    </p>
                    <p className="mt-1 text-[10px] text-[#756E67]">
                      {order.payment?.status === "paid"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-[#3A342E]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-[#756E67]">
                        {vnd(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
