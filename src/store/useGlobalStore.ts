import { create } from 'zustand';

export interface GlobalState {
  apiUrl: string;
  googleAuthUrl: string;
  frontendUrl: string;
  setApiUrl: (v: string) => void;
  setGoogleAuthUrl: (v: string) => void;
  setFrontendUrl: (v: string) => void;
  reset: () => void;
}

const defaultApi = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
const defaultGoogle =
  (import.meta.env.VITE_GOOGLE_AUTH_URL as string) || `${defaultApi.replace(/\/$/, '')}/auth/google`;
const defaultFrontend = (import.meta.env.VITE_FRONTEND_URL as string) || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

const useGlobalStore = create<GlobalState>((set) => ({
  apiUrl: defaultApi,
  googleAuthUrl: defaultGoogle,
  frontendUrl: defaultFrontend,

  setApiUrl: (v: string) => set({ apiUrl: v }),
  setGoogleAuthUrl: (v: string) => set({ googleAuthUrl: v }),
  setFrontendUrl: (v: string) => set({ frontendUrl: v }),

  reset: () =>
    set({
      apiUrl: defaultApi,
      googleAuthUrl: defaultGoogle,
      frontendUrl: defaultFrontend,
    }),
}));

export default useGlobalStore;
