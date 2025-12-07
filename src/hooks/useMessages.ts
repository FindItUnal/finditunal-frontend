import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, MessageRecord, SendMessagePayload } from '../services/chatService';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';
import { Message } from '../types';

/**
 * Hook para obtener los mensajes de una conversación
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
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: false, // Evitar refetch al cambiar de ventana
    // Removido refetchInterval - ahora usamos Socket.IO para actualizaciones en tiempo real
  });

  // Transformar datos del backend al formato esperado por el frontend
  const transformedData: Message[] | undefined = query.data?.map((msg: MessageRecord) => ({
    id: msg.message_id.toString(),
    senderId: msg.sender_id,
    senderName: msg.sender_id === userId ? 'Tú' : 'Usuario', // Se puede mejorar con nombre real
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
 */
export function useSendMessage() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      messageText 
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
    onSuccess: (_, { conversationId }) => {
      // Invalidar mensajes de esta conversación
      queryClient.invalidateQueries({ queryKey: ['messages', apiUrl, userId, conversationId] });
      // Invalidar la lista de conversaciones para actualizar el último mensaje
      queryClient.invalidateQueries({ queryKey: ['conversations', apiUrl, userId] });
    },
  });
}
