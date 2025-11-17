import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set: any) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useUserStore;
