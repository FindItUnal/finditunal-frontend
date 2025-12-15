import { useEffect, useState } from 'react';
import { AppRoutes } from '../routes';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { profileService, notificationService } from '../services';
import { LoadingSpinner } from './atoms';
import { useSocketIO } from '../hooks/useSocketIO';
import { useQueryClient } from '@tanstack/react-query';
import { socketService, FullNotificationData } from '../services/socketService';
import { useNotificationToast } from '../context/NotificationToastContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/userUtils';

export default function AppInitializer() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Inicializar Socket.IO cuando hay usuario autenticado
  useSocketIO();

  // Escuchar notificaciones en tiempo real
  useEffect(() => {
    const checkSession = async () => {
      // Si estamos en páginas públicas donde no necesitamos verificar sesión, no hacer nada
      const publicPaths = ['/banned', '/login', '/'];
      if (publicPaths.includes(location.pathname)) {
        // Solo verificar si el usuario local está baneado para redirigir
        if (user && user.is_active === 2) {
          console.log('[AppInitializer] Usuario local baneado, redirigiendo a /banned');
          navigate('/banned', { replace: true });
        }
        setIsChecking(false);
        return;
      }

      // Si hay usuario en localStorage, verificar si está baneado
      if (user) {
        // Si el usuario local ya indica que está baneado, redirigir inmediatamente
        if (user.is_active === 2) {
          console.log('[AppInitializer] Usuario local baneado, redirigiendo a /banned');
          navigate('/banned', { replace: true });
          setIsChecking(false);
          return;
        }
        
        // Verificar el estado del usuario con el backend para asegurar que is_active esté actualizado
        try {
          const userData = await profileService.getProfile(apiUrl);
          console.log('[AppInitializer] Usuario desde backend:', { is_active: userData.is_active });
          setUser(userData);
          
          // Si el usuario está baneado (is_active = 2), redirigir a /banned
          if ((userData as any).is_active === 2) {
            console.log('[AppInitializer] Usuario baneado según backend, redirigiendo a /banned');
            navigate('/banned', { replace: true });
          }
        } catch (error) {
          // Si falla la verificación, limpiar el usuario del store
          console.debug('Error verificando sesión, limpiando usuario');
          setUser(null);
        }
        setIsChecking(false);
        return;
      }

      // Si NO hay usuario en localStorage, verificar si existe sesión activa en el backend
      // Esto cubre el caso donde el usuario cerró la pestaña pero la sesión sigue activa
      try {
        const userData = await profileService.getProfile(apiUrl);
        console.log('[AppInitializer] Usuario nuevo desde backend:', { is_active: (userData as any).is_active });
        setUser(userData);
        
        // Si el usuario está baneado (is_active = 2), redirigir a /banned
        if ((userData as any).is_active === 2) {
          console.log('[AppInitializer] Usuario nuevo baneado, redirigiendo a /banned');
          navigate('/banned', { replace: true });
        }
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
  }, [user, setUser, apiUrl, navigate, location.pathname]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner message="Cargando..." centered={false} />
      </div>
    );
  }

  return <AppRoutes />;
}
