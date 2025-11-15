import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';
import useUserStore from '../store/useUserStore';

type View = 'landing' | 'login' | 'register' | 'dashboard' | 'profile' | 'messages' | 'admin-dashboard' | 'admin-users' | 'admin-reports';

interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
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
    if (pathname === '/register') return 'register';
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

  const logout = () => {
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
