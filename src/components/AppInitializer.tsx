import { useEffect, useState } from 'react';
import { AppRoutes } from '../routes';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { profileService } from '../services';
import { LoadingSpinner } from './atoms';
import { useSocketIO } from '../hooks/useSocketIO';

export default function AppInitializer() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const [isChecking, setIsChecking] = useState(true);
  
  // Inicializar Socket.IO cuando hay usuario autenticado
  useSocketIO();

  useEffect(() => {
    const checkSession = async () => {
      // Siempre verificar si existe sesión activa en el backend
      // Esto valida el token y asegura que la sesión no haya expirado
      try {
        const userData = await profileService.getProfile(apiUrl);
        setUser(userData);
      } catch (error) {
        // No hay sesión activa o token expirado - limpiar estado local
        console.debug('No active session found');
        if (user) {
          // Si había un usuario en localStorage pero la sesión expiró, limpiarlo
          setUser(null);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]); // Solo ejecutar al montar el componente

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner message="Cargando..." centered={false} />
      </div>
    );
  }

  return <AppRoutes />;
}
