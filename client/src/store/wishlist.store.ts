import { create } from 'zustand';
import { api } from '../lib/api';

export interface WishlistProduct {
  _id: string;
  name: string;
  images?: string[];
  brand?: { _id: string; name?: string };
  category?: { _id: string; name?: string };
  isActive?: boolean;
}

interface WishlistState {
  products: WishlistProduct[];
  loading: boolean; // global loading for fetch
  error: string | null;
  pending: string[]; // productIds with pending requests
  fetchWishlist: () => Promise<void>;
  addProduct: (productId: string) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  toggleProduct: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  isPending: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  pending: [],

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/wishlist');
      const products = res?.data?.data?.products ?? [];
      set({ products, loading: false });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e?.message ?? 'Error', loading: false });
    }
  },

  addProduct: async (productId: string) => {
    set((s) => ({ pending: [...s.pending, productId], error: null }));
    try {
      const res = await api.post(`/wishlist/${productId}`);
      const products = res?.data?.data?.products ?? [];
      set({ products, pending: [], error: null });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e?.message ?? 'Error', pending: [] });
      throw e;
    }
  },

  removeProduct: async (productId: string) => {
    set((s) => ({ pending: [...s.pending, productId], error: null }));
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      const products = res?.data?.data?.products ?? [];
      set({ products, pending: [], error: null });
    } catch (e: any) {
      set({ error: e?.response?.data?.message ?? e?.message ?? 'Error', pending: [] });
      throw e;
    }
  },

  toggleProduct: async (productId: string) => {
    const isFav = get().isFavorite(productId);
    if (isFav) return get().removeProduct(productId);
    return get().addProduct(productId);
  },

  isFavorite: (productId: string) => {
    return get().products.some((p) => String(p._id) === String(productId));
  },

  isPending: (productId: string) => get().pending.includes(productId),

  clearWishlist: () => set({ products: [], loading: false, error: null, pending: [] }),
}));
