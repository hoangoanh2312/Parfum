import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToast, ToastType } from "../store/toast.store";

// Viền màu bên trái theo loại thông báo
const BORDER: Record<ToastType, string> = {
  success: "border-l-4 border-green-500",
  error: "border-l-4 border-red-500",
  info: "border-l-4 border-[#a67c1a]",
};

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success")
    return (
      <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
    );
  if (type === "error")
    return <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />;
  return <Info size={20} className="text-[#a67c1a] shrink-0 mt-0.5" />;
}

export default function Toaster() {
  const { toasts, remove } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-[340px] max-w-[90vw]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            "flex items-start gap-3 bg-white shadow-xl rounded-lg px-4 py-3 transition-all " +
            BORDER[t.type]
          }
        >
          <ToastIcon type={t.type} />
          <p className="flex-1 text-sm text-gray-800 whitespace-pre-line leading-snug">
            {t.message}
          </p>
          <button
            onClick={() => remove(t.id)}
            className="text-gray-400 hover:text-gray-700 shrink-0"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
