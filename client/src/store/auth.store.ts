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

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ user: null });
  },
}));