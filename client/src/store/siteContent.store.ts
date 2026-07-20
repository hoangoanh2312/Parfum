// =============================================================================
//  SITE CONTENT STORE
//  Tai 1 lan map { key: url } cac anh da duoc admin doi (override) tu API cong
//  khai /site-content. Component dung useSiteImage(key, fallback) de lay anh:
//  neu co override thi dung, khong thi dung fallback (anh mac dinh trong code).
// =============================================================================
import { create } from "zustand";
import { api } from "../lib/api";

interface SiteContentState {
  map: Record<string, string>;
  loaded: boolean;
  load: () => Promise<void>;
}

export const useSiteContent = create<SiteContentState>((set, get) => ({
  map: {},
  loaded: false,
  load: async () => {
    try {
      const res = await api.get("/site-content");
      // Backend tra ve { success, data: { key: url } }
      const data = res.data?.data ?? res.data ?? {};
      set({ map: data && typeof data === "object" ? data : {}, loaded: true });
    } catch {
      // Loi mang -> giu map rong, frontend tu dung anh mac dinh
      set({ loaded: true });
    }
    void get;
  },
}));

// Hook tien loi: lay 1 anh theo key, co anh fallback mac dinh.
export function useSiteImage(key: string, fallback: string): string {
  return useSiteContent((s) => s.map[key] || fallback);
}

// Hook lay ca map (dung khi render danh sach nhieu anh trong 1 vong lap).
export function useSiteImages(): Record<string, string> {
  return useSiteContent((s) => s.map);
}
