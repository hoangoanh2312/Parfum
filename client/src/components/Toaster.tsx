import { AlertTriangle, CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToast, ToastType } from "../store/toast.store";

// Viền màu bên trái theo loại thông báo
const BORDER: Record<ToastType, string> = {
  success: "border-l-4 border-green-500",
  error: "border-l-4 border-red-500",
  warning: "border-l-4 border-amber-500",
  info: "border-l-4 border-[#a67c1a]",
};

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success")
    return (
      <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
    );
  if (type === "error")
    return <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />;
  if (type === "warning")
    return <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" />;
  return <Info size={20} className="text-[#a67c1a] shrink-0 mt-0.5" />;
}

export default function Toaster() {
  const { toasts, remove } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-4 z-[9999] flex flex-col items-end gap-3 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-6 sm:w-[340px]" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.type === "error" || t.type === "warning" ? "alert" : "status"}
          className={
            "pointer-events-auto flex w-full items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-xl transition-all motion-reduce:transition-none " +
            BORDER[t.type]
          }
        >
          <ToastIcon type={t.type} />
          <p className="flex-1 text-sm text-gray-800 whitespace-pre-line leading-snug">
            {t.message}
          </p>
          <button
            type="button"
            onClick={() => remove(t.id)}
            className="text-gray-400 hover:text-gray-700 shrink-0"
            aria-label="Đóng thông báo"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
