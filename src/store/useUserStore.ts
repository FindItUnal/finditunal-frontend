import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      updateUser: (patch: Partial<User>) =>
        set((state) => ({ user: state.user ? { ...state.user, ...patch } : null })),
      logout: () => set({ user: null }),
    }),
    {
      name: 'finditunal-user', // localStorage key
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useUserStore;
