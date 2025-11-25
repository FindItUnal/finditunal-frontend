import { useEffect, useState } from 'react';
import { AppRoutes } from '../routes';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { profileService } from '../services';

export default function AppInitializer() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Si ya hay usuario en Zustand (localStorage persiste el estado), renderizar directamente
      if (user) {
        setIsChecking(false);
        return;
      }

      // Si NO hay usuario en localStorage, verificar si existe sesión activa en el backend
      // Esto cubre el caso donde el usuario cerró la pestaña pero la sesión sigue activa
      try {
        const userData = await profileService.getProfile(apiUrl);
        setUser(userData);
      } catch (error) {
        // No hay sesión activa - usuario debe hacer login
        console.debug('No active session found');
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [user, setUser, apiUrl]);

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
