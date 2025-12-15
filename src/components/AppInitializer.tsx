import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Inicializar Socket.IO cuando hay usuario autenticado
  useSocketIO();

  useEffect(() => {
    const checkSession = async () => {
      // Si estamos en /banned, no interferir
      if (location.pathname === '/banned') {
        setIsChecking(false);
        return;
      }

      // Si hay usuario en localStorage, verificar si está baneado
      if (user) {
        // Verificar el estado del usuario con el backend para asegurar que is_active esté actualizado
        try {
          const userData = await profileService.getProfile(apiUrl);
          setUser(userData);
          
          // Si el usuario está baneado (is_active = 2), redirigir a /banned
          if (userData.is_active === 2) {
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
        setUser(userData);
        
        // Si el usuario está baneado (is_active = 2), redirigir a /banned
        if (userData.is_active === 2) {
          navigate('/banned', { replace: true });
        }
      } catch (error) {
        // No hay sesión activa - usuario debe hacer login
        console.debug('No active session found');
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
