import { useEffect, useRef, useState, useCallback } from 'react';
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
  const hasConnected = useRef(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Solo conectar si hay usuario autenticado y no se ha conectado antes
    if (!userId || hasConnected.current) return;

    console.log('🔌 Conectando Socket.IO...');
    const socket = socketService.connect(apiUrl);
    hasConnected.current = true;
    setIsConnected(true);

    socket.on('connect', () => {
      console.log('✅ Conectado a Socket.IO');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado de Socket.IO');
      setIsConnected(false);
    });

    // Cleanup al desmontar
    return () => {
      console.log('🔌 Desconectando Socket.IO...');
      socketService.disconnect();
      hasConnected.current = false;
      setIsConnected(false);
    };
  }, [userId, apiUrl]);

  const joinConversation = useCallback((conversationId: number) => {
    socketService.joinConversation(conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: number) => {
    socketService.leaveConversation(conversationId);
  }, []);

  const markAsRead = useCallback((conversationId: number) => {
    socketService.markAsRead(conversationId);
  }, []);

  const onNewMessage = useCallback((callback: (message: MessageData) => void) => {
    socketService.onNewMessage(callback);
  }, []);

  const offNewMessage = useCallback(() => {
    socketService.offNewMessage();
  }, []);

  return {
    isConnected,
    joinConversation,
    leaveConversation,
    markAsRead,
    onNewMessage,
    offNewMessage,
  };
}
