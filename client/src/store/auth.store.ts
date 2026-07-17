import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
<<<<<<< HEAD
  addresses?: Address[];
}

export interface Address {
  _id: string;
  label: string;
  phone: string;
  detail: string;
}

interface AuthState {
  user: User | null;
  isBootstrapped: boolean;
  setUser: (user: User | null) => void;
  setBootstrapped: (value: boolean) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
  bootstrap: () => Promise<void>;
}

interface JWTPayload {
  id: string;
  role: string;
  exp: number;
}

const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = decodeJwt<JWTPayload>(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

function decodeJwt<T>(token: string): T {
  const payload = token.split('.')[1];
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(normalized);
  return JSON.parse(decoded) as T;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isBootstrapped: false,

  setUser: (user) => set({ user }),

  setBootstrapped: (value) => set({ isBootstrapped: value }),

  setTokens: (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
=======
}

interface AuthState {
  user: User | null;
  setUser: (u: User | null) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}

const savedUser = localStorage.getItem('user');

export const useAuth = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },

  // Lưu token sau khi đăng nhập/đăng ký. lib/api.ts sẽ tự đính kèm
  // "Authorization: Bearer <accessToken>" cho mọi request nhờ đọc localStorage.
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
<<<<<<< HEAD
    set({ user: null, isBootstrapped: true });
  },

  bootstrap: async () => {
    const token = localStorage.getItem('accessToken');
    if (isValidToken(token)) {
      try {
        const { data } = await api.get('/auth/me');
        set({
          user: {
            id: data._id || data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            addresses: data.addresses || [],
          },
          isBootstrapped: true,
        });
      } catch {
        const decoded = decodeJwt<User & JWTPayload>(token!);
        set({ user: { id: decoded.id, name: '', email: '', role: decoded.role }, isBootstrapped: true });
      }
    } else {
      set({ user: null, isBootstrapped: true });
    }
=======
    localStorage.removeItem('user');
    set({ user: null });
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
  },
}));
