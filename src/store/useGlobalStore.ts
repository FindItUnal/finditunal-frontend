import { create } from 'zustand';

const sanitizeBaseUrl = (value?: string) => {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed ? trimmed.replace(/\/$/, '') : '';
};

export interface GlobalState {
  apiUrl: string;
  googleAuthUrl: string;
  frontendUrl: string;
  setApiUrl: (v: string) => void;
  setGoogleAuthUrl: (v: string) => void;
  setFrontendUrl: (v: string) => void;
  reset: () => void;
}

const defaultApi = sanitizeBaseUrl(import.meta.env.VITE_API_URL as string | undefined);
const envGoogleUrl = sanitizeBaseUrl(import.meta.env.VITE_GOOGLE_AUTH_URL as string | undefined);
const defaultGoogle = envGoogleUrl || (defaultApi ? `${defaultApi}/auth/google` : '');
// Prefer explicit environment configuration; fall back to the current origin when available.
const resolveFrontendOrigin = () => {
  const envFrontend = sanitizeBaseUrl(import.meta.env.VITE_FRONTEND_URL as string | undefined);
  if (envFrontend) return envFrontend;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return sanitizeBaseUrl(window.location.origin);
  }
  return '';
};
const defaultFrontend = resolveFrontendOrigin();

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
