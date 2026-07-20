import { create } from 'zustand';
import { api } from '../lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const savedUser = localStorage.getItem('user');

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // token het han van xoa local
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null });
  },
}));
