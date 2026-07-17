import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: ToastItem[];
  show: (type: ToastType, message: string) => void;
  remove: (id: number) => void;
}

let seq = 0;

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  show: (type, message) => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    // Tự ẩn sau 3.5s
    setTimeout(() => get().remove(id), 3500);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// Helper gọi nhanh, không cần hook: toast.success('...'), toast.error('...')
export const toast = {
  success: (m: string) => useToast.getState().show("success", m),
  error: (m: string) => useToast.getState().show("error", m),
  info: (m: string) => useToast.getState().show("info", m),
};
