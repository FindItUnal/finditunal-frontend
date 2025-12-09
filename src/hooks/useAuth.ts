import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { User } from '../types';

export interface UseAuthReturn {
  /** @deprecated Mock login - usar autenticación con Google en producción */
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  user: User | null;
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logoutFromStore = useUserStore((s) => s.logout);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const isAuthenticated = user !== null;

  /**
   * @deprecated Esta función usa autenticación mock.
   * En producción usar el flujo de Google OAuth (/auth/callback)
   */
  const login = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (email: string, _password: string) => {
      // TODO: Eliminar mock authentication - usar Google OAuth
      console.warn('useAuth.login() es una función mock - usar Google OAuth en producción');
      const mockUser: User = {
        id: '1',
        name: 'Usuario Demo',
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        status: 'active',
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
