import { create } from 'zustand';
import { api } from '../lib/api';

export interface CartItem {
  variant: string;       // id của Variant (khóa định danh item trong giỏ)
  product?: string;
  name?: string;
  slug?: string;
  image?: string | null;
  volume?: string;
  price: number;
  stock?: number;
  quantity: number;
  lineTotal?: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  count: number;
  loadCart: () => Promise<void>;
  addItem: (item: CartItem, quantity?: number) => Promise<void>;
  updateItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clear: () => Promise<void>;
  syncOnLogin: () => Promise<void>;
}

const GUEST_KEY = 'guest_cart';
// Đã đăng nhập hay chưa? (dựa vào accessToken trong localStorage)
const isAuthed = () => !!localStorage.getItem('accessToken');

function readGuest(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
  } catch {
    return [];
  }
}
function writeGuest(items: CartItem[]) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}
// Tính lại tổng tiền + tổng số lượng cho giỏ khách vãng lai
function totals(items: CartItem[]) {
  const withLine = items.map((i) => ({ ...i, lineTotal: i.price * i.quantity }));
  const total = withLine.reduce((s, x) => s + (x.lineTotal || 0), 0);
  const count = withLine.reduce((s, x) => s + x.quantity, 0);
  return { items: withLine, total, count };
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  count: 0,

  // Nạp giỏ: đăng nhập -> lấy từ DB; chưa -> lấy từ localStorage
  loadCart: async () => {
    if (isAuthed()) {
      const { data } = await api.get('/cart');
      set({ items: data.data.items, total: data.data.total, count: data.data.count });
    } else {
      set(totals(readGuest()));
    }
  },

  addItem: async (item, quantity = 1) => {
    if (isAuthed()) {
      const { data } = await api.post('/cart/items', { variant: item.variant, quantity });
      set({ items: data.data.items, total: data.data.total, count: data.data.count });
    } else {
      // stock là số > 0 -> giới hạn; = 0 -> hết hàng; undefined -> không giới hạn
      if (typeof item.stock === 'number' && item.stock <= 0) {
        throw Object.assign(new Error('Sản phẩm đã hết hàng'), { status: 409 });
      }
      const items = readGuest();
      const line = items.find((i) => i.variant === item.variant);
      const cap = typeof item.stock === 'number' ? item.stock : Number.MAX_SAFE_INTEGER;
      if (line) line.quantity = Math.min(line.quantity + quantity, cap);
      else items.push({ ...item, quantity: Math.min(quantity, cap) });
      writeGuest(items);
      set(totals(items));
    }
  },

  updateItem: async (variantId, quantity) => {
    if (isAuthed()) {
      const { data } = await api.put(`/cart/items/${variantId}`, { quantity });
      set({ items: data.data.items, total: data.data.total, count: data.data.count });
    } else {
      let items = readGuest();
      if (quantity <= 0) {
        items = items.filter((i) => i.variant !== variantId);
      } else {
        items = items.map((i) =>
          i.variant === variantId
            ? { ...i, quantity: Math.min(quantity, i.stock ?? Number.MAX_SAFE_INTEGER) }
            : i,
        );
      }
      writeGuest(items);
      set(totals(items));
    }
  },

  removeItem: async (variantId) => {
    if (isAuthed()) {
      const { data } = await api.delete(`/cart/items/${variantId}`);
      set({ items: data.data.items, total: data.data.total, count: data.data.count });
    } else {
      const items = readGuest().filter((i) => i.variant !== variantId);
      writeGuest(items);
      set(totals(items));
    }
  },

  clear: async () => {
    if (isAuthed()) {
      const { data } = await api.delete('/cart');
      set({ items: data.data.items, total: data.data.total, count: data.data.count });
    } else {
      writeGuest([]);
      set({ items: [], total: 0, count: 0 });
    }
  },

  // Gọi NGAY SAU khi đăng nhập thành công:
  // đẩy giỏ khách vãng lai lên DB (cộng dồn) rồi nạp lại giỏ từ DB.
  syncOnLogin: async () => {
    const guest = readGuest();
    if (guest.length) {
      await api.post('/cart/merge', {
        items: guest.map((g) => ({ variant: g.variant, quantity: g.quantity })),
      });
      writeGuest([]);
    }
    await get().loadCart();
  },
}));
