import { create } from 'zustand';
import { api } from '../lib/api';

export interface CartItem { variant: string; product?: string; name?: string; slug?: string; image?: string | null; volume?: string; price: number; stock?: number; quantity: number; lineTotal?: number }
type CartState = { items: CartItem[]; total: number; count: number; loadCart: () => Promise<void>; addItem: (item: CartItem, quantity?: number) => Promise<void>; updateItem: (id: string, quantity: number) => Promise<void>; removeItem: (id: string) => Promise<void>; clear: () => Promise<void>; syncOnLogin: () => Promise<void> };
const KEY = 'guest_cart'; const authed = () => Boolean(localStorage.getItem('accessToken'));
const guest = (): CartItem[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const summarize = (items: CartItem[]) => ({ items: items.map(i => ({ ...i, lineTotal: i.price * i.quantity })), total: items.reduce((s, i) => s + i.price * i.quantity, 0), count: items.reduce((s, i) => s + i.quantity, 0) });
const saveGuest = (items: CartItem[]) => localStorage.setItem(KEY, JSON.stringify(items));
export const useCart = create<CartState>((set, get) => ({
  items: [], total: 0, count: 0,
  loadCart: async () => { if (authed()) { const { data } = await api.get('/cart'); set(data.data); } else set(summarize(guest())); },
  addItem: async (item, quantity = 1) => { if (authed()) { const { data } = await api.post('/cart/items', { variant: item.variant, quantity }); set(data.data); return; } const items = guest(); const existing = items.find(i => i.variant === item.variant); if (existing) existing.quantity += quantity; else items.push({ ...item, quantity }); saveGuest(items); set(summarize(items)); },
  updateItem: async (id, quantity) => { if (authed()) { const { data } = await api.put(`/cart/items/${id}`, { quantity }); set(data.data); return; } const items = guest().map(i => i.variant === id ? { ...i, quantity } : i).filter(i => i.quantity > 0); saveGuest(items); set(summarize(items)); },
  removeItem: async (id) => { if (authed()) { const { data } = await api.delete(`/cart/items/${id}`); set(data.data); return; } const items = guest().filter(i => i.variant !== id); saveGuest(items); set(summarize(items)); },
  clear: async () => { if (authed()) { const { data } = await api.delete('/cart'); set(data.data); return; } saveGuest([]); set({ items: [], total: 0, count: 0 }); },
  syncOnLogin: async () => { const items = guest(); if (items.length) await api.post('/cart/merge', { items: items.map(({ variant, quantity }) => ({ variant, quantity })) }); saveGuest([]); await get().loadCart(); },
}));
