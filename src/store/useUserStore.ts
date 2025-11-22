import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import * as userService from '../services/userService';

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (patch: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  logout: (apiBase?: string, navigate?: (path: string) => void) => Promise<void>;
  refreshUser: (apiBase: string) => Promise<void>;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      
      setUser: (user: User | null) => set({ user }),
      
      updateUser: (patch: Partial<User>) =>
        set((state) => ({ user: state.user ? { ...state.user, ...patch } : null })),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      logout: async (apiBase?: string, navigate?: (path: string) => void) => {
        try {
          const base = apiBase || import.meta.env.VITE_API_URL || 'http://localhost:3000';
          await userService.logoutRequest(base);
        } catch (err) {
          // ignorar errores de red pero limpiar estado local
        }
        set({ user: null });
        if (navigate) navigate('/');
      },
      
      refreshUser: async (apiBase: string) => {
        try {
          const data = await userService.getProfile(apiBase);
          set({ user: data });
        } catch (error) {
          console.error('Error refreshing user:', error);
        }
      },
    }),
    {
      name: 'finditunal-user', // localStorage key
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useUserStore;
