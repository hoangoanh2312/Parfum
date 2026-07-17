import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null });
  },
}));
