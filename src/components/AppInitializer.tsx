import { useEffect, useState } from 'react';
import { AppRoutes } from '../routes';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { profileService } from '../services';
import { LoadingSpinner } from './atoms';
import { useSocketIO } from '../hooks/useSocketIO';
import { useQueryClient } from '@tanstack/react-query';
import { socketService, FullNotificationData } from '../services/socketService';
import { useNotificationToast } from '../context/NotificationToastContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AppInitializer() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const [isChecking, setIsChecking] = useState(true);
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Inicializar Socket.IO cuando hay usuario autenticado
  useSocketIO();

  // Escuchar notificaciones en tiempo real
  useEffect(() => {
    if (!user) return;

    const cleanup = socketService.onFullNotification((notification: FullNotificationData) => {
      console.log('📬 Nueva notificación recibida:', notification);
      
      // Si es una notificación de mensaje de chat
      if (notification.type === 'message' && notification.related_id) {
        const conversationId = notification.related_id;
        
        // NO mostrar toast si ya estás en esa conversación
        const currentPath = location.pathname;
        const isInActiveConversation = currentPath === `/messages/${conversationId}`;
        
        if (isInActiveConversation) {
          console.log('🔕 Suprimiendo notificación toast - ya estás en la conversación activa');
          // Solo invalidar queries pero no mostrar toast
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          return;
        }
        
        // Mostrar toast clickeable con navegación
        if (notification.message) {
          showNotification(
            notification.message, 
            notification.type,
            conversationId,
            () => {
              // Al hacer click: navegar y marcar como leída
              navigate(`/messages/${conversationId}`);
              // Marcar la notificación como leída vía Socket.IO
              socketService.markAsRead(conversationId);
              // Invalidar queries
              queryClient.invalidateQueries({ queryKey: ['notifications'] });
              queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
            }
          );
        }
      } else {
        // Para otros tipos de notificaciones, mostrar normalmente
        if (notification.message) {
          showNotification(notification.message, notification.type);
        }
      }
      
      // Invalidar cache de React Query para actualizar contadores
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    return cleanup;
  }, [user, queryClient, showNotification, location.pathname, navigate]);

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
