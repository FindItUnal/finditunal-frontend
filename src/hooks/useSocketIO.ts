import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketService, MessageData } from '../services/socketService';
import useGlobalStore from '../store/useGlobalStore';
import useUserStore from '../store/useUserStore';
import { getUserId } from '../utils/userUtils';

/**
 * Hook para manejar la conexión de Socket.IO y eventos en tiempo real
 */
export function useSocketIO() {
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const user = useUserStore((s) => s.user);
  const userId = user ? getUserId(user) : null;
  const queryClient = useQueryClient();
  const hasConnected = useRef(false);

  useEffect(() => {
    // Solo conectar si hay usuario autenticado y no se ha conectado antes
    if (!userId || hasConnected.current) return;

    console.log('🔌 Conectando Socket.IO...');
    socketService.connect(apiUrl);
    hasConnected.current = true;

    // Listener para nuevos mensajes
    socketService.onNewMessage((message: MessageData) => {
      console.log('📨 Nuevo mensaje recibido:', message);
      
      // Invalidar mensajes de esa conversación
      queryClient.invalidateQueries({ 
        queryKey: ['messages', apiUrl, userId, message.conversation_id] 
      });
      
      // Invalidar lista de conversaciones para actualizar último mensaje
      queryClient.invalidateQueries({ 
        queryKey: ['conversations', apiUrl, userId] 
      });
    });

    // Listener para notificaciones
    socketService.onNewNotification((notification) => {
      console.log('🔔 Nueva notificación:', notification);
      
      // Invalidar conversaciones cuando llega un mensaje nuevo
      if (notification.type === 'chat_message') {
        queryClient.invalidateQueries({ 
          queryKey: ['conversations', apiUrl, userId] 
        });
      }
    });

    // Cleanup al desmontar
    return () => {
      console.log('🔌 Desconectando Socket.IO...');
      socketService.offNewMessage();
      socketService.offNewNotification();
      socketService.disconnect();
      hasConnected.current = false;
    };
  }, [userId, apiUrl, queryClient]);

  return {
    isConnected: socketService.isConnected(),
    joinConversation: socketService.joinConversation.bind(socketService),
    leaveConversation: socketService.leaveConversation.bind(socketService),
    markAsRead: socketService.markAsRead.bind(socketService),
  };
}
