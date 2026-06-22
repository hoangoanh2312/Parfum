import { create } from 'zustand';

interface AuthState {
  user: { id: string; name: string; email: string; role: string } | null;
  setUser: (u: AuthState['user']) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => { localStorage.removeItem('accessToken'); set({ user: null }); },
}));
