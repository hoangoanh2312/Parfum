import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isBootstrapped: false,

  setUser: (user) => set({ user }),

  setBootstrapped: (value) => set({ isBootstrapped: value }),

  setTokens: (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isBootstrapped: true });
  },

  bootstrap: async () => {
    const token = localStorage.getItem('accessToken');
    if (isValidToken(token)) {
      const decoded = jwtDecode<User & JWTPayload>(token!);
      set({ user: { id: decoded.id, name: '', email: '', role: decoded.role }, isBootstrapped: true });
    } else {
      set({ user: null, isBootstrapped: true });
    }
  },
}));