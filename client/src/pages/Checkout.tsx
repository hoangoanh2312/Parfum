import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, CreditCard, Banknote, ShieldCheck } from "lucide-react";
import { useCart } from "../store/cart.store";
import { api } from "../lib/api";
import { toast } from "../store/toast.store";
import Footer from "../components/Footer";

const vnd = (n: number) => (n || 0).toLocaleString("vi-VN") + "₫";
const PLACEHOLDER = "https://placehold.co/120x150?text=No+Image";

type Method = "cod" | "bank_qr";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, count, loadCart } = useCart();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Việt Nam");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<Method>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const canSubmit = useMemo(
    () =>
      !!email.trim() &&
      !!firstName.trim() &&
      !!address.trim() &&
      !!city.trim() &&
      !!phone.trim() &&
      items.length > 0,
    [email, firstName, address, city, phone, items.length],
  );

  async function placeOrder() {
    if (!items.length) {
      toast.error("Giỏ hàng đang trống.");
      navigate("/cart");
      return;
    }
    if (!canSubmit) {
      toast.error(
        "Vui lòng điền đầy đủ email, họ tên, địa chỉ, thành phố và số điện thoại.",
      );
      return;
    }

    const fullName = (firstName.trim() + " " + lastName.trim()).trim();
    const addressPayload = {
      line: [address.trim(), apartment.trim()].filter(Boolean).join(", "),
      city: [city.trim(), postalCode.trim(), country.trim()]
        .filter(Boolean)
        .join(", "),
      phone: phone.trim(),
    };
    const fullNote = [
      fullName && "Người nhận: " + fullName,
      email.trim() && "Email: " + email.trim(),
      note.trim() && "Ghi chú: " + note.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setSubmitting(true);
      const { data } = await api.post("/orders", {
        method,
        address: addressPayload,
        note: fullNote,
      });
      await loadCart();
      toast.success("Đặt hàng thành công!");
      navigate("/thank-you/" + data.data.orderId);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Không thể tạo đơn, vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full border border-[rgba(208,197,175,0.6)] bg-white px-4 py-3 font-['Manrope'] text-sm text-[#1C1C19] outline-none focus:border-[#735C00] duration-200";
  const labelCls =
    "block font-['Manrope'] text-xs uppercase tracking-[1.5px] text-[#5F5E5E] mb-2";

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 py-12 bg-[#FDF9F4]">
        <header className="mb-10">
          <h1 className="font-['Noto_Serif'] text-4xl md:text-5xl text-[#1C1C19] tracking-[-1.5px]">
            Thanh toán
          </h1>
          <p className="font-['Manrope'] uppercase tracking-[3px] text-xs text-[#5F5E5E] mt-3">
            Thông tin · Giao hàng · Thanh toán
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Cột trái: form */}
          <div className="lg:col-span-3 space-y-10">
            {/* Bước 1: Thông tin liên hệ */}
            <div>
              <h2 className="font-['Noto_Serif'] text-2xl text-[#1C1C19] mb-5">
                <span className="text-[#735C00]">1.</span> Thông tin liên hệ
              </h2>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                className={inputCls}
                placeholder="email@vidu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Bước 2: Địa chỉ giao hàng */}
            <div>
              <h2 className="font-['Noto_Serif'] text-2xl text-[#1C1C19] mb-5">
                <span className="text-[#735C00]">2.</span> Địa chỉ giao hàng
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Họ</label>
                  <input
                    className={inputCls}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Tên</label>
                  <input
                    className={inputCls}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelCls}>Địa chỉ</label>
                <input
                  className={inputCls}
                  placeholder="Số nhà, tên đường"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className={labelCls}>Căn hộ, tầng (tùy chọn)</label>
                <input
                  className={inputCls}
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className={labelCls}>Mã bưu chính</label>
                  <input
                    className={inputCls}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Thành phố</label>
                  <input
                    className={inputCls}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Quốc gia</label>
                  <input
                    className={inputCls}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelCls}>Số điện thoại</label>
                <input
                  className={inputCls}
                  placeholder="09xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Bước 3: Thanh toán */}
            <div>
              <h2 className="font-['Noto_Serif'] text-2xl text-[#1C1C19] mb-5">
                <span className="text-[#735C00]">3.</span> Phương thức thanh
                toán
              </h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setMethod("cod")}
                  className={
                    "w-full flex items-center gap-4 border px-5 py-4 text-left duration-200 " +
                    (method === "cod"
                      ? "border-[#735C00] bg-[#F7F3EE]"
                      : "border-[rgba(208,197,175,0.6)] bg-white hover:border-[#735C00]/50")
                  }
                >
                  <Banknote size={22} className="text-[#735C00] shrink-0" />
                  <span>
                    <span className="block font-['Manrope'] font-semibold text-[#1C1C19]">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="block font-['Manrope'] text-xs text-[#5F5E5E] mt-0.5">
                      Trả tiền mặt khi nhận sản phẩm
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("bank_qr")}
                  className={
                    "w-full flex items-center gap-4 border px-5 py-4 text-left duration-200 " +
                    (method === "bank_qr"
                      ? "border-[#735C00] bg-[#F7F3EE]"
                      : "border-[rgba(208,197,175,0.6)] bg-white hover:border-[#735C00]/50")
                  }
                >
                  <CreditCard size={22} className="text-[#735C00] shrink-0" />
                  <span>
                    <span className="block font-['Manrope'] font-semibold text-[#1C1C19]">
                      Chuyển khoản QR (VietQR)
                    </span>
                    <span className="block font-['Manrope'] text-xs text-[#5F5E5E] mt-0.5">
                      Quét mã QR chuyển khoản sau khi đặt đơn
                    </span>
                  </span>
                </button>
              </div>

              <div className="mt-6">
                <label className={labelCls}>Ghi chú đơn hàng (tùy chọn)</label>
                <textarea
                  className={inputCls + " min-h-[90px] resize-y"}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Cột phải: tóm tắt đơn */}
          <div className="lg:col-span-2">
            <div className="bg-[#F7F3EE] border border-[rgba(208,197,175,0.4)] p-6 lg:sticky lg:top-6">
              <h2 className="font-['Noto_Serif'] text-2xl text-[#1C1C19] mb-6">
                Đơn hàng của bạn
              </h2>

              <div className="space-y-4 max-h-[320px] overflow-auto pr-1">
                {items.map((it) => (
                  <div key={it.variant} className="flex gap-4">
                    <div className="w-16 h-20 bg-white flex items-center justify-center shrink-0">
                      <img
                        src={it.image || PLACEHOLDER}
                        alt={it.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            PLACEHOLDER;
                        }}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Noto_Serif'] text-base text-[#1C1C19] truncate">
                        {it.name}
                      </h3>
                      <p className="font-['Manrope'] uppercase tracking-[1px] text-[11px] text-[#5F5E5E] mt-0.5">
                        {it.volume} · SL {it.quantity}
                      </p>
                    </div>
                    <span className="font-['Manrope'] text-sm text-[#1C1C19] whitespace-nowrap">
                      {vnd(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[rgba(208,197,175,0.5)] mt-6 pt-5 space-y-3 font-['Manrope'] text-sm">
                <div className="flex justify-between text-[#5F5E5E]">
                  <span>Tạm tính ({count} sản phẩm)</span>
                  <span className="text-[#1C1C19]">{vnd(total)}</span>
                </div>
                <div className="flex justify-between text-[#5F5E5E]">
                  <span>Phí vận chuyển</span>
                  <span className="text-[#1C1C19]">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center border-t border-[rgba(208,197,175,0.5)] pt-4 mt-1">
                  <span className="font-['Noto_Serif'] text-lg text-[#1C1C19]">
                    Tổng cộng
                  </span>
                  <span className="font-['Noto_Serif'] text-2xl text-[#1C1C19]">
                    {vnd(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={submitting}
                className="w-full mt-6 bg-[#735C00] text-white py-4 font-['Manrope'] uppercase tracking-[3px] text-sm hover:bg-[#5c4a00] duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Lock size={15} />
                {submitting ? "Đang xử lý…" : "Đặt hàng"}
              </button>

              <p className="flex items-center justify-center gap-2 font-['Manrope'] text-[11px] text-[#5F5E5E] mt-4">
                <ShieldCheck size={14} /> Thanh toán an toàn & bảo mật
              </p>
              <Link
                to="/cart"
                className="block text-center font-['Manrope'] text-xs uppercase tracking-[2px] text-[#735C00] hover:underline mt-3"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
