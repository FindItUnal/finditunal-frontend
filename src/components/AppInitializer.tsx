import { useEffect, useState } from 'react';
import { AppRoutes } from '../routes';
import useUserStore from '../store/useUserStore';

export default function AppInitializer() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Si ya hay usuario en Zustand (localStorage), no verificar sesión
    if (user) {
      setIsChecking(false);
      return;
    }

    // Verificar si hay sesión activa en el backend (cookie httpOnly)
    const checkSession = async () => {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      try {
        const response = await fetch(`${apiBase.replace(/\/$/, '')}/user/profile`, {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        // No hay sesión activa - es normal
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [user, setUser]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}
