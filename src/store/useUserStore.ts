import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authService, profileService } from '../services';

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (patch: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  logout: (apiUrl: string, navigate?: (path: string) => void) => Promise<void>;
  refreshUser: (apiUrl: string) => Promise<void>;
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
      
      logout: async (apiUrl: string, navigate?: (path: string) => void) => {
        try {
          await authService.logout(apiUrl);
        } catch (err) {
          // ignorar errores de red pero limpiar estado local
        }
        set({ user: null });
        if (navigate) navigate('/');
      },
      
      refreshUser: async (apiUrl: string) => {
        try {
          const data = await profileService.getProfile(apiUrl);
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
