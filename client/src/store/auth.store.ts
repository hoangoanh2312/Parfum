import { create } from 'zustand';

interface AuthState {
  user: { id: string; name: string; email: string; role: string } | null;
  setUser: (u: AuthState['user']) => void;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null });
  },
  setTokens: (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },
}));
