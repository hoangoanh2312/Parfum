import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, ShoppingBag, Lock, Truck, X } from "lucide-react";
import { useCart } from "../store/cart.store";
import { api } from "../lib/api";
import { toast } from "../store/toast.store";
import ProductCard, { ProductCardData } from "../components/ProductCard";
import Footer from "../components/Footer";

const vnd = (n: number) => (n || 0).toLocaleString("vi-VN") + "₫";
const PLACEHOLDER = "https://placehold.co/200x260?text=No+Image";

export default function Cart() {
  const { items, total, count, loadCart, updateItem, removeItem, clear } =
    useCart();
  const navigate = useNavigate();
  // variantId -> số lượng CÒN LẠI thực tế trong kho (kiểm tra realtime)
  const [available, setAvailable] = useState<Record<string, number>>({});
  // Danh sách sản phẩm tương tự (load từ API)
  const [similar, setSimilar] = useState<ProductCardData[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  // Load "Sản phẩm tương tự" từ API sản phẩm thật
  useEffect(() => {
    let active = true;
    api
      .get("/products")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.data;
        if (active) setSimilar(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        // bỏ qua nếu lỗi, chỉ là gợi ý
      });
    return () => {
      active = false;
    };
  }, []);

  // Kiểm tra tồn kho THỰC TẾ mỗi khi giỏ thay đổi
  const verifyStock = useCallback(async () => {
    if (!items.length) {
      setAvailable({});
      return;
    }
    try {
      const { data } = await api.post("/orders/check-stock", {
        items: items.map((i) => ({ variant: i.variant, quantity: i.quantity })),
      });
      const map: Record<string, number> = {};
      for (const d of data.data.items) map[d.variant] = d.available;
      setAvailable(map);
    } catch {
      // Nếu kiểm tra lỗi thì không chặn hiển thị giỏ
    }
  }, [items]);

  useEffect(() => {
    verifyStock();
  }, [verifyStock]);

  // Có item nào không đủ tồn kho không?
  const hasOutOfStock = items.some((it) => {
    const av = available[it.variant];
    return typeof av === "number" && av < it.quantity;
  });

  function checkout() {
    if (hasOutOfStock) {
      toast.error(
        "Một số sản phẩm đã hết hàng, vui lòng cập nhật giỏ trước khi thanh toán.",
      );
      return;
    }
    // PF-36: chuyển sang trang thanh toán (chọn COD hoặc chuyển khoản QR)
    navigate("/checkout");
  }

  // Loại bỏ sản phẩm đã có trong giỏ, lấy tối đa 4 gợi ý
  const inCart = new Set(items.map((i) => i.variant));
  const suggestions = similar
    .filter((p) => p.variantId && !inCart.has(p.variantId))
    .slice(0, 4);

  if (!items.length) {
    return (
      <>
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center bg-[#FDF9F4]">
          <ShoppingBag size={60} className="text-[#735C00] mb-6" />
          <h1 className="font-['Noto_Serif'] text-4xl text-[#1C1C19] mb-3">
            Giỏ hàng trống
          </h1>
          <p className="font-['Manrope'] text-[#5F5E5E] mb-8">
            Hãy thêm sản phẩm yêu thích vào giỏ.
          </p>
          <Link
            to="/shop"
            className="border border-[#735C00] text-[#735C00] px-8 py-3 font-['Manrope'] uppercase tracking-[3px] text-sm hover:bg-[#735C00] hover:text-white duration-300"
          >
            Tiếp tục mua sắm
          </Link>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-12 bg-[#FDF9F4]">
        <header className="mb-10">
          <h1 className="font-['Noto_Serif'] text-5xl text-[#1C1C19] tracking-[-1.8px]">
            Giỏ hàng của bạn
          </h1>
          <p className="font-['Manrope'] uppercase tracking-[3px] text-xs text-[#5F5E5E] mt-3">
            Tuyển chọn cho trải nghiệm của bạn
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Cột trái: danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-8">
            {items.map((it) => {
              const av = available[it.variant];
              const soldOut = typeof av === "number" && av <= 0;
              const notEnough =
                typeof av === "number" && av > 0 && av < it.quantity;
              return (
                <div
                  key={it.variant}
                  className="flex gap-6 border-b border-[rgba(208,197,175,0.2)] pb-8"
                >
                  <div className="w-28 h-36 flex-shrink-0 bg-[#F7F3EE] flex items-center justify-center">
                    <img
                      src={it.image || PLACEHOLDER}
                      alt={it.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                      }}
                      className={
                        "w-full h-full object-cover mix-blend-multiply " +
                        (soldOut ? "opacity-60 grayscale" : "opacity-90")
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-['Noto_Serif'] text-2xl text-[#1C1C19]">
                          {it.name}
                        </h3>
                        <p className="font-['Manrope'] uppercase tracking-[1.4px] text-xs text-[#5F5E5E] mt-1">
                          {it.volume}
                        </p>
                      </div>
                      <span className="font-['Noto_Serif'] text-xl text-[#1C1C19] whitespace-nowrap">
                        {vnd(it.price)}
                      </span>
                    </div>

                    {soldOut && (
                      <p className="text-red-600 text-sm font-semibold mt-2">
                        Đã hết hàng
                      </p>
                    )}
                    {notEnough && (
                      <p className="text-red-600 text-sm font-semibold mt-2">
                        Chỉ còn {av} sản phẩm
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center border border-[rgba(208,197,175,0.4)] font-['Manrope'] text-[#1C1C19]">
                        <button
                          className="px-3 py-2 hover:bg-[#F1EDE8]"
                          onClick={() =>
                            updateItem(it.variant, it.quantity - 1)
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-center min-w-[2.5rem]">
                          {it.quantity}
                        </span>
                        <button
                          className="px-3 py-2 hover:bg-[#F1EDE8]"
                          onClick={() =>
                            updateItem(it.variant, it.quantity + 1)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className="flex items-center gap-2 font-['Manrope'] text-xs uppercase tracking-[1.2px] text-[#5F5E5E] hover:text-red-500"
                        onClick={() => removeItem(it.variant)}
                      >
                        <X size={14} /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clear}
              className="font-['Manrope'] text-sm text-[#5F5E5E] hover:text-red-500 underline underline-offset-4"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </div>

          {/* Cột phải: tóm tắt đơn hàng */}
          <aside className="border border-[rgba(208,197,175,0.4)] bg-[#F1EDE8] p-8 lg:sticky lg:top-6 font-['Manrope']">
            <h2 className="font-['Noto_Serif'] text-2xl text-[#1C1C19] mb-6 pb-6 border-b border-[rgba(208,197,175,0.2)]">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-4 text-sm border-b border-[rgba(208,197,175,0.2)] pb-6">
              <div className="flex justify-between">
                <span className="text-[#5F5E5E] tracking-[0.35px]">
                  Tạm tính ({count} sản phẩm)
                </span>
                <span className="text-[#1C1C19]">{vnd(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5E5E] tracking-[0.35px]">
                  Vận chuyển
                </span>
                <span className="uppercase text-[10px] font-bold tracking-[1px] text-[#735C00]">
                  Miễn phí
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5E5E] tracking-[0.35px]">Thuế</span>
                <span className="text-[#1C1C19]">{vnd(0)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-6 border-t border-[rgba(208,197,175,0.4)] mt-0">
              <span className="font-['Noto_Serif'] text-lg text-[#1C1C19]">
                Tổng cộng
              </span>
              <span className="font-['Noto_Serif'] text-3xl text-[#1C1C19]">
                {vnd(total)}
              </span>
            </div>

            {hasOutOfStock && (
              <p className="text-red-600 text-sm mb-3">
                Một số sản phẩm đã hết hàng, vui lòng cập nhật giỏ.
              </p>
            )}

            <button
              onClick={checkout}
              disabled={hasOutOfStock}
              className={
                "w-full py-5 font-['Manrope'] uppercase tracking-[3.5px] text-sm duration-300 " +
                (hasOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#735C00] text-white hover:bg-black")
              }
            >
              Tiến hành thanh toán →
            </button>

            <div className="mt-6 space-y-4 text-xs text-[#4D4635]">
              <div className="flex gap-3">
                <Lock size={16} className="text-[#735C00] shrink-0 mt-0.5" />
                <div>
                  <p className="uppercase tracking-[1px] text-[10px] font-bold text-[#1C1C19]">
                    Thanh toán an toàn
                  </p>
                  <p>Giao dịch của bạn được mã hóa và bảo vệ.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Truck size={16} className="text-[#735C00] shrink-0 mt-0.5" />
                <div>
                  <p className="uppercase tracking-[1px] text-[10px] font-bold text-[#1C1C19]">
                    Giao hàng tận nơi
                  </p>
                  <p>2-3 ngày làm việc, có xác nhận khi giao.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Sản phẩm tương tự (thay cho Complimentary Samples) */}
        {suggestions.length > 0 && (
          <div className="mt-20">
            <h2 className="font-['Noto_Serif'] text-3xl text-[#1C1C19] mb-2">
              Sản phẩm tương tự
            </h2>
            <p className="font-['Manrope'] text-[#5F5E5E] text-sm mb-8 tracking-[0.35px]">
              Có thể bạn cũng sẽ thích những mùi hương này
            </p>
            <div className="grid md:grid-cols-4 gap-8">
              {suggestions.map((p) => (
                <ProductCard key={p.id} item={p} />
              ))}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
