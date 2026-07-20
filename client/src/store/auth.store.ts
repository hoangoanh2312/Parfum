import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (u: User | null) => void;
  setAuth: (payload: { accessToken: string; refreshToken: string; user: User }) => void;
  logout: () => void;
}

const getStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, accessToken: null, refreshToken: null };
  }

  const savedUser = localStorage.getItem('user');
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

export const useAuth = create<AuthState>((set) => {
  const initial = getStoredAuth();

  return {
    user: initial.user,
    accessToken: initial.accessToken,
    refreshToken: initial.refreshToken,

    setUser: (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }

      set({ user });
    },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ user: null });
  },
}));
