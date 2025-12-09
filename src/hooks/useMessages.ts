import { useQuery, useMutation } from '@tanstack/react-query';
import { chatService, MessageRecord, SendMessagePayload } from '../services/chatService';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';
import { Message } from '../types';

/**
 * Hook para obtener los mensajes de una conversación
 * NOTA: Para tiempo real, usar el estado local + Socket.IO en MessagesPage
 */
export function useMessages(conversationId: number | null, enabled: boolean = true) {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;

  const query = useQuery({
    queryKey: ['messages', apiUrl, userId, conversationId],
    queryFn: async () => {
      if (!userId || !conversationId) throw new Error('Usuario o conversación no válida');
      return chatService.getMessages(apiUrl, String(userId), conversationId);
    },
    enabled: enabled && !!userId && !!conversationId,
    staleTime: Infinity, // No refetch automático - Socket.IO maneja actualizaciones
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Transformar datos del backend al formato esperado por el frontend
  const transformedData: Message[] | undefined = query.data?.map((msg: MessageRecord) => ({
    id: msg.message_id.toString(),
    senderId: msg.sender_id,
    senderName: msg.sender_id === userId ? 'Tú' : 'Usuario',
    content: msg.message_text,
    timestamp: msg.created_at,
    read: msg.is_read === 1,
  }));

  return {
    ...query,
    data: transformedData,
  };
}

/**
 * Hook para enviar un mensaje
 * NOTA: Socket.IO maneja las actualizaciones en tiempo real,
 * no se invalidan queries para evitar conflictos
 */
export function useSendMessage() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageText,
    }: {
      conversationId: number;
      messageText: string;
    }) => {
      if (!userId) throw new Error('Usuario no autenticado');

      const payload: SendMessagePayload = {
        message_text: messageText,
      };

      return chatService.sendMessage(apiUrl, String(userId), conversationId, payload);
    },
    // No invalidamos queries - Socket.IO emitirá message:new que actualiza el estado local
  });
}
