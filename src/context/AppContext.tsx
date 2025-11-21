import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import * as userService from '../services/userService';

type View = 'landing' | 'login' | 'dashboard' | 'profile' | 'messages' | 'admin-dashboard' | 'admin-users' | 'admin-reports';

interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  function pathToView(pathname: string): View {
    if (pathname.startsWith('/admin/users')) return 'admin-users';
    if (pathname.startsWith('/admin/reports')) return 'admin-reports';
    if (pathname.startsWith('/admin')) return 'admin-dashboard';
    if (pathname.startsWith('/messages')) return 'messages';
    if (pathname.startsWith('/profile')) return 'profile';
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    if (pathname === '/login') return 'login';
    return 'landing';
  }

  const [currentView, setCurrentView] = useState<View>(() => pathToView(location.pathname));
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logoutFromStore = useUserStore((s) => s.logout);

  const isAuthenticated = user !== null;

  useEffect(() => {
    const v = pathToView(location.pathname);
    setCurrentView(v);
  }, [location.pathname]);

  // On mount try to load authenticated user from backend (uses httpOnly cookies)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const resp = await fetch(`${apiBase.replace(/\/$/, '')}/user/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        if (!resp.ok) return;

        const data = await resp.json();
        // set user in zustand store
        setUser(data);

        // If on landing or login, redirect to dashboard
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/dashboard');
        }
      } catch (error) {
        // ignore — user will remain unauthenticated
      }
    };

    loadProfile();
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || useGlobalStore.getState().apiUrl;
      await userService.logoutRequest(apiBase);
    } catch (err) {
      // ignore network errors but still clear local state
    }

    logoutFromStore();
    setCurrentView('landing');
    navigate('/');
  };

  return (
    <AppContext.Provider value={{ currentView, setCurrentView, user, setUser, isAuthenticated, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
