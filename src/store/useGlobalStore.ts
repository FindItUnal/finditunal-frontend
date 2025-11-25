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

// Configuración desde variables de entorno
const defaultApi = import.meta.env.VITE_API_URL as string;
const defaultGoogle = import.meta.env.VITE_GOOGLE_AUTH_URL as string;
const defaultFrontend = import.meta.env.VITE_FRONTEND_URL as string;

// Validar que las variables de entorno estén configuradas
if (!defaultApi) {
  throw new Error('VITE_API_URL no está configurada en las variables de entorno');
}
if (!defaultGoogle) {
  throw new Error('VITE_GOOGLE_AUTH_URL no está configurada en las variables de entorno');
}
if (!defaultFrontend) {
  throw new Error('VITE_FRONTEND_URL no está configurada en las variables de entorno');
}

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
