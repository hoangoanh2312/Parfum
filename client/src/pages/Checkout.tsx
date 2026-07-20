import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "../store/cart.store";
import { api } from "../lib/api";
import { toast } from "../store/toast.store";
import Footer from "../components/Footer";

const vnd = (n: number) => (n || 0).toLocaleString("vi-VN") + "₫";
const PLACEHOLDER = "https://placehold.co/120x150?text=No+Image";

type Method = "cod" | "bank_qr";
type ShippingMethod = "standard" | "express";

const steps = ["Địa chỉ", "Vận chuyển", "Thanh toán", "Xác nhận"];
const shippingFees: Record<ShippingMethod, number> = {
  standard: 0,
  express: 35000,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, count, loadCart, clear } = useCart();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Việt Nam");
  const [phone, setPhone] = useState("");
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [method, setMethod] = useState<Method>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const shippingFee = shippingFees[shipping];
  const grandTotal = total + shippingFee;
  const fullName = (firstName.trim() + " " + lastName.trim()).trim();
  const addressLine = [address.trim(), apartment.trim()]
    .filter(Boolean)
    .join(", ");
  const addressCity = [city.trim(), postalCode.trim(), country.trim()]
    .filter(Boolean)
    .join(", ");

  const addressValid = useMemo(
    () =>
      !!email.trim() &&
      !!firstName.trim() &&
      !!address.trim() &&
      !!city.trim() &&
      /^0\d{9}$/.test(phone.trim()) &&
      items.length > 0,
    [email, firstName, address, city, phone, items.length],
  );

  function nextStep() {
    if (step === 1 && !addressValid) {
      toast.error(
        "Vui lòng nhập đủ địa chỉ và số điện thoại 10 số bắt đầu bằng 0.",
      );
      return;
    }
    setStep((current) => Math.min(4, current + 1));
  }

  async function placeOrder() {
    if (!items.length) {
      toast.error("Giỏ hàng đang trống.");
      navigate("/cart");
      return;
    }

    if (!addressValid) {
      toast.error("Vui lòng kiểm tra lại thông tin giao hàng.");
      setStep(1);
      return;
    }

    const fullNote = [
      fullName && "Người nhận: " + fullName,
      email.trim() && "Email: " + email.trim(),
      "Vận chuyển: " + (shipping === "standard" ? "Tiêu chuẩn" : "Nhanh"),
      shippingFee > 0 && "Phí vận chuyển: " + vnd(shippingFee),
      note.trim() && "Ghi chú: " + note.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setSubmitting(true);
      const { data } = await api.post("/orders", {
        method,
        address: {
          fullName,
          line: addressLine,
          city: addressCity,
          province: city.trim(),
          phone: phone.trim(),
        },
        note: fullNote,
        items: items.map((item) => ({
          variant: item.variant,
          quantity: item.quantity,
        })),
      });

      await clear();
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

  if (!items.length) {
    return (
      <>
        <section className="min-h-[60vh] bg-[#FDF9F4] px-6 py-20 text-center">
          <h1 className="font-['Noto_Serif'] text-4xl text-[#1C1C19]">
            Giỏ hàng trống
          </h1>
          <p className="mt-3 font-['Manrope'] text-[#5F5E5E]">
            Thêm sản phẩm vào giỏ trước khi thanh toán.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex border border-[#735C00] px-8 py-3 font-['Manrope'] text-sm uppercase tracking-[2px] text-[#735C00] hover:bg-[#735C00] hover:text-white"
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
      <section className="mx-auto max-w-6xl bg-[#FDF9F4] px-6 py-12">
        <header className="mb-10">
          <h1 className="font-['Noto_Serif'] text-4xl tracking-[-1.5px] text-[#1C1C19] md:text-5xl">
            Thanh toán
          </h1>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {steps.map((label, index) => {
              const number = index + 1;
              const active = step === number;
              const done = step > number;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => number < step && setStep(number)}
                  className={
                    "flex items-center gap-3 border px-4 py-3 text-left font-['Manrope'] text-xs uppercase tracking-[1.5px] " +
                    (active
                      ? "border-[#735C00] bg-[#F7F3EE] text-[#1C1C19]"
                      : "border-[rgba(208,197,175,0.45)] text-[#5F5E5E]")
                  }
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-[11px]">
                    {done ? <CheckCircle2 size={14} /> : number}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="grid items-start gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {step === 1 && (
              <Panel title="1. Địa chỉ giao hàng">
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="email@vidu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                  />
                </div>
              </Panel>
            )}

            {step === 2 && (
              <Panel title="2. Vận chuyển">
                <Choice
                  active={shipping === "standard"}
                  icon={<Truck size={22} />}
                  title="Giao hàng tiêu chuẩn"
                  detail="2-3 ngày làm việc"
                  price="Miễn phí"
                  onClick={() => setShipping("standard")}
                />
                <Choice
                  active={shipping === "express"}
                  icon={<Truck size={22} />}
                  title="Giao hàng nhanh"
                  detail="Trong 24 giờ nội thành"
                  price={vnd(shippingFees.express)}
                  onClick={() => setShipping("express")}
                />
              </Panel>
            )}

            {step === 3 && (
              <Panel title="3. Thanh toán">
                <Choice
                  active={method === "cod"}
                  icon={<Banknote size={22} />}
                  title="Thanh toán khi nhận hàng (COD)"
                  detail="Trả tiền mặt khi nhận sản phẩm"
                  onClick={() => setMethod("cod")}
                />
                <Choice
                  active={method === "bank_qr"}
                  icon={<CreditCard size={22} />}
                  title="Chuyển khoản QR (VietQR)"
                  detail="Quét mã QR sau khi đặt đơn"
                  onClick={() => setMethod("bank_qr")}
                />
                <div className="mt-6">
                  <label className={labelCls}>
                    Ghi chú đơn hàng (tùy chọn)
                  </label>
                  <textarea
                    className={inputCls + " min-h-[90px] resize-y"}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </Panel>
            )}

            {step === 4 && (
              <Panel title="4. Xác nhận đơn hàng">
                <div className="space-y-4 font-['Manrope'] text-sm text-[#1C1C19]">
                  <SummaryRow label="Người nhận" value={fullName} />
                  <SummaryRow label="Email" value={email} />
                  <SummaryRow label="Điện thoại" value={phone} />
                  <SummaryRow
                    label="Địa chỉ"
                    value={[addressLine, addressCity]
                      .filter(Boolean)
                      .join(" - ")}
                  />
                  <SummaryRow
                    label="Vận chuyển"
                    value={
                      shipping === "standard" ? "Tiêu chuẩn" : "Giao nhanh"
                    }
                  />
                  <SummaryRow
                    label="Thanh toán"
                    value={method === "cod" ? "COD" : "VietQR"}
                  />
                </div>
              </Panel>
            )}

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  step === 1
                    ? navigate("/cart")
                    : setStep((current) => current - 1)
                }
                className="border border-[#735C00] px-7 py-3 font-['Manrope'] text-xs uppercase tracking-[2px] text-[#735C00]"
              >
                {step === 1 ? "Quay lại giỏ" : "Quay lại"}
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#735C00] px-7 py-3 font-['Manrope'] text-xs uppercase tracking-[2px] text-white"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#735C00] px-7 py-3 font-['Manrope'] text-xs uppercase tracking-[2px] text-white disabled:opacity-60"
                >
                  <Lock size={15} />
                  {submitting ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              )}
            </div>
          </div>

          <aside className="lg:col-span-2">
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
                <SummaryRow
                  label={`Tạm tính (${count} sản phẩm)`}
                  value={vnd(total)}
                />
                <SummaryRow
                  label="Phí vận chuyển"
                  value={shippingFee ? vnd(shippingFee) : "Miễn phí"}
                />
                <div className="flex justify-between items-center border-t border-[rgba(208,197,175,0.5)] pt-4 mt-1">
                  <span className="font-['Noto_Serif'] text-lg text-[#1C1C19]">
                    Tổng cộng
                  </span>
                  <span className="font-['Noto_Serif'] text-2xl text-[#1C1C19]">
                    {vnd(grandTotal)}
                  </span>
                </div>
              </div>

              <p className="flex items-center justify-center gap-2 font-['Manrope'] text-[11px] text-[#5F5E5E] mt-5">
                <ShieldCheck size={14} /> Thanh toán an toàn & bảo mật
              </p>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-[rgba(208,197,175,0.4)] bg-white p-6">
      <h2 className="mb-6 font-['Noto_Serif'] text-2xl text-[#1C1C19]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Choice({
  active,
  icon,
  title,
  detail,
  price,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  detail: string;
  price?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "mb-3 flex w-full items-center gap-4 border px-5 py-4 text-left duration-200 " +
        (active
          ? "border-[#735C00] bg-[#F7F3EE]"
          : "border-[rgba(208,197,175,0.6)] bg-white hover:border-[#735C00]/50")
      }
    >
      <span className="text-[#735C00] shrink-0">{icon}</span>
      <span className="flex-1">
        <span className="block font-['Manrope'] font-semibold text-[#1C1C19]">
          {title}
        </span>
        <span className="block font-['Manrope'] text-xs text-[#5F5E5E] mt-0.5">
          {detail}
        </span>
      </span>
      {price && (
        <span className="font-['Manrope'] text-sm text-[#735C00]">{price}</span>
      )}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-5 text-[#5F5E5E]">
      <span>{label}</span>
      <span className="text-right text-[#1C1C19]">{value}</span>
    </div>
  );
}