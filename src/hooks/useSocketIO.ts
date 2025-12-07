import { useEffect, useRef, useState, useCallback } from 'react';
import {
  socketService,
  MessageData,
  NotificationData,
  ConversationReadData,
} from '../services/socketService';
import useGlobalStore from '../store/useGlobalStore';
import useUserStore from '../store/useUserStore';
import { getUserId } from '../utils/userUtils';

export type { MessageData, NotificationData, ConversationReadData };

/**
 * Hook para manejar la conexión de Socket.IO y eventos en tiempo real
 */
export function useSocketIO() {
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const user = useUserStore((s) => s.user);
  const userId = user ? getUserId(user) : null;
  const hasConnected = useRef(false);
  const [isConnected, setIsConnected] = useState(socketService.isConnected());

  useEffect(() => {
    // Solo conectar si hay usuario autenticado
    if (!userId) return;

    // Evitar reconexiones innecesarias
    if (hasConnected.current && socketService.isConnected()) {
      return;
    }

    console.log('🔌 Conectando Socket.IO...');
    const socket = socketService.connect(apiUrl);
    hasConnected.current = true;

    const handleConnect = () => {
      console.log('✅ Conectado a Socket.IO');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('❌ Desconectado de Socket.IO');
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Actualizar estado inicial
    setIsConnected(socket.connected);

    // Cleanup al desmontar
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [userId, apiUrl]);

  // Desconectar cuando el usuario cierra sesión
  useEffect(() => {
    if (!userId && hasConnected.current) {
      console.log('🔌 Desconectando Socket.IO (logout)...');
      socketService.disconnect();
      hasConnected.current = false;
      setIsConnected(false);
    }
  }, [userId]);

  const joinConversation = useCallback((conversationId: number) => {
    socketService.joinConversation(conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: number) => {
    socketService.leaveConversation(conversationId);
  }, []);

  const markAsRead = useCallback((conversationId: number) => {
    socketService.markAsRead(conversationId);
  }, []);

  const sendMessage = useCallback((conversationId: number, messageText: string) => {
    socketService.sendMessage(conversationId, messageText);
  }, []);

  // Los callbacks ahora retornan funciones de cleanup
  const onNewMessage = useCallback((callback: (message: MessageData) => void) => {
    return socketService.onNewMessage(callback);
  }, []);

  const onNewNotification = useCallback((callback: (notification: NotificationData) => void) => {
    return socketService.onNewNotification(callback);
  }, []);

  const onConversationRead = useCallback((callback: (data: ConversationReadData) => void) => {
    return socketService.onConversationRead(callback);
  }, []);

  return {
    isConnected,
    joinConversation,
    leaveConversation,
    markAsRead,
    sendMessage,
    onNewMessage,
    onNewNotification,
    onConversationRead,
  };
}
