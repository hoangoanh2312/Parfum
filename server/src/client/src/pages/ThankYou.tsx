import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Copy, Package } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "../store/toast.store";
import Footer from "../components/Footer";

const vnd = (n: number) => (n || 0).toLocaleString("vi-VN") + "₫";

type OrderInfo = { id: string; total: number; status: string };
type PayInfo = {
  method: string;
  status: string;
  amount: number;
  bank: { bin: string; accountNo: string; accountName: string };
  transferContent: string;
  qrUrl: string;
};

export default function ThankYou() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [pay, setPay] = useState<PayInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get("/orders/" + id);
        if (!active) return;
        setOrder({
          id: data.data.id,
          total: data.data.total,
          status: data.data.status,
        });
        const method = data.data.payment?.method;
        if (method === "bank_qr") {
          const res = await api.get("/orders/" + id + "/payment");
          if (active) setPay(res.data.data);
        }
      } catch (e: any) {
        if (active)
          setError(e?.response?.data?.message || "Không tìm thấy đơn hàng");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  function copy(text: string) {
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Đã sao chép"),
      () => toast.error("Không sao chép được"),
    );
  }

  return (
    <>
      <section className="max-w-2xl mx-auto px-6 py-16 bg-[#FDF9F4] min-h-[70vh] text-center">
        {loading && (
          <p className="font-['Manrope'] text-[#5F5E5E]">Đang tải…</p>
        )}
        {!loading && error && (
          <p className="font-['Manrope'] text-red-600">{error}</p>
        )}

        {!loading && order && (
          <>
            <CheckCircle2
              size={64}
              className="text-green-600 mx-auto mb-6"
              strokeWidth={1.5}
            />
            <h1 className="font-['Noto_Serif'] text-4xl text-[#1C1C19]">
              Cảm ơn bạn đã đặt hàng!
            </h1>
            <p className="font-['Manrope'] text-[#5F5E5E] mt-3">
              Mã đơn hàng của bạn là{" "}
              <span className="font-semibold text-[#735C00]">
                #{order.id.slice(-6).toUpperCase()}
              </span>
            </p>
            <p className="font-['Noto_Serif'] text-2xl text-[#1C1C19] mt-2">
              {vnd(order.total)}
            </p>

            {/* Chuyển khoản QR */}
            {pay && pay.method === "bank_qr" && (
              <div className="bg-white border border-[rgba(208,197,175,0.5)] p-6 mt-8 text-left">
                <h2 className="font-['Noto_Serif'] text-xl text-[#1C1C19] text-center mb-5">
                  Quét mã QR để thanh toán
                </h2>
                {pay.qrUrl && (
                  <img
                    src={pay.qrUrl}
                    alt="VietQR"
                    className="w-60 h-60 object-contain mx-auto border border-[rgba(208,197,175,0.4)] bg-white"
                  />
                )}
                <div className="font-['Manrope'] text-sm text-[#1C1C19] mt-6 space-y-2">
                  <Row label="Ngân hàng (BIN)" value={pay.bank.bin} />
                  <Row
                    label="Số tài khoản"
                    value={pay.bank.accountNo}
                    onCopy={() => copy(pay.bank.accountNo)}
                  />
                  <Row label="Chủ tài khoản" value={pay.bank.accountName} />
                  <Row label="Số tiền" value={vnd(pay.amount)} />
                  <Row
                    label="Nội dung CK"
                    value={pay.transferContent}
                    onCopy={() => copy(pay.transferContent)}
                  />
                </div>
                <p className="font-['Manrope'] text-xs text-[#5F5E5E] mt-4 text-center">
                  Vui lòng ghi đúng nội dung chuyển khoản để đơn được xác nhận
                  nhanh.
                </p>
              </div>
            )}

            {pay === null && !error && (
              <div className="bg-[#F7F3EE] border border-[rgba(208,197,175,0.4)] p-5 mt-8 font-['Manrope'] text-sm text-[#1C1C19]">
                Thanh toán khi nhận hàng (COD). Bạn sẽ trả tiền khi nhận sản
                phẩm.
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center mt-10">
              <Link
                to={"/orders/" + order.id}
                className="inline-flex items-center gap-2 bg-[#735C00] text-white px-8 py-3 font-['Manrope'] uppercase tracking-[2px] text-sm hover:bg-[#5c4a00] duration-300"
              >
                <Package size={16} /> Xem chi tiết đơn
              </Link>
              <Link
                to="/shop"
                className="border border-[#735C00] text-[#735C00] px-8 py-3 font-['Manrope'] uppercase tracking-[2px] text-sm hover:bg-[#735C00] hover:text-white duration-300"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}

function Row({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
}) {
  return (
    <div className="flex justify-between items-center gap-3 border-b border-[rgba(208,197,175,0.3)] pb-2">
      <span className="text-[#5F5E5E]">{label}</span>
      <span className="flex items-center gap-2 text-right font-semibold">
        {value}
        {onCopy && (
          <button
            onClick={onCopy}
            className="text-[#735C00] hover:opacity-70"
            title="Sao chép"
          >
            <Copy size={14} />
          </button>
        )}
      </span>
    </div>
  );
}
