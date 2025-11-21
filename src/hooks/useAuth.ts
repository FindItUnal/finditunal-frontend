import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCallback } from 'react';

export interface UseAuthReturn {
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  user: any;
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const { setUser, user, logout: contextLogout, isAuthenticated } = useApp();

  const login = useCallback(
    (email: string, _password: string) => {
      // Mock authentication logic
      const mockUser = {
        id: '1',
        name: 'Usuario Demo',
        email: email,
        role: email.includes('admin') ? ('admin' as const) : ('user' as const),
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);

      // Navigate based on role
      if (mockUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    },
    [navigate, setUser]
  );

  const logout = useCallback(async () => {
    await contextLogout();
  }, [contextLogout]);

  return {
    login,
    logout,
    isAuthenticated,
    user,
  };
}
