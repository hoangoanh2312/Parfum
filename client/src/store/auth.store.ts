import { create } from 'zustand';

export interface Address { _id: string; label?: string; fullName?: string; phone?: string; line?: string; detail?: string; ward?: string; district?: string; province?: string; isDefault?: boolean }
export interface User { id: string; name: string; email: string; role: string; addresses?: Address[] }
type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
};

function getUser(): User | null {
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
}

export const useAuth = create<AuthState>((set) => ({
  user: getUser(),
  setUser: (user) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user });
  },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  },
  logout: () => {
    localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); localStorage.removeItem('user');
    set({ user: null });
  },
}));