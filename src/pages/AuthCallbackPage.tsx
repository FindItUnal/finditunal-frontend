import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const loadUserAfterAuth = async () => {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      try {
        const response = await fetch(`${apiBase.replace(/\/$/, '')}/user/profile`, {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Redirigir según el rol
          if (userData.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          // Si no hay sesión válida, redirigir al login
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error loading user after auth:', error);
        navigate('/login', { replace: true });
      }
    };

    loadUserAfterAuth();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
