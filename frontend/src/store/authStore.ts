import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  hasPermiso: (permiso: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      hasPermiso: (permiso: string) => {
        const u = get().user;
        return !!u && (u.permisos.includes(permiso) || u.permisos.includes('ADMIN_FULL'));
      },
    }),
    { name: 'sanblas-auth' }
  )
);
