import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';

export interface UseAuthReturn {
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  user: any;
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logoutFromStore = useUserStore((s) => s.logout);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const isAuthenticated = user !== null;

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
    await logoutFromStore(apiUrl, navigate);
  }, [logoutFromStore, apiUrl, navigate]);

  return {
    login,
    logout,
    isAuthenticated,
    user,
  };
}
