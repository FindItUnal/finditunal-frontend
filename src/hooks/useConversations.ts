import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, ConversationSummary } from '../services/chatService';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';
import { Chat } from '../types';

/**
 * Hook para verificar si existe una conversación para un reporte
 */
export function useConversationExists(reportId: number | null, enabled: boolean = true) {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;

  return useQuery({
    queryKey: ['conversationExists', apiUrl, userId, reportId],
    queryFn: async () => {
      if (!userId || !reportId) throw new Error('Usuario o reporte no válido');
      return chatService.checkConversationExists(apiUrl, String(userId), reportId);
    },
    enabled: enabled && !!userId && !!reportId,
    staleTime: 10000, // 30 segundos
  });
}

/**
 * Hook para obtener todas las conversaciones del usuario
 */
export function useConversations() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;

  const query = useQuery({
    queryKey: ['conversations', apiUrl, userId],
    queryFn: async () => {
      if (!userId) throw new Error('Usuario no autenticado');
      return chatService.getConversations(apiUrl, String(userId));
    },
    enabled: !!userId,
    staleTime: 10000, // 30 segundos (aumentado de 10)
    refetchOnWindowFocus: false, // Evitar refetch al cambiar de ventana
  });

  // Transformar datos del backend al formato esperado por el frontend
  const transformedData: Chat[] | undefined = query.data?.map((conv: ConversationSummary) => ({
    id: conv.conversation_id.toString(),
    participantId: conv.other_user_id,
    participantName: conv.other_user_name,
    lastMessage: conv.last_message_text || 'Sin mensajes',
    lastMessageTime: conv.last_message_at || conv.updated_at,
    unreadCount: conv.unread_count,
    reportId: conv.report_id,
    reportTitle: conv.report_title,
  }));

  return {
    ...query,
    data: transformedData,
  };
}

/**
 * Hook para crear o recuperar una conversación
 */
export function useCreateConversation() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: number) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return chatService.createConversation(apiUrl, String(userId), reportId);
    },
    onSuccess: (_, reportId: number) => {
      // Invalidar la verificación de existencia
      queryClient.invalidateQueries({ queryKey: ['conversationExists', apiUrl, userId, reportId] });
      // Invalidar la lista de conversaciones
      queryClient.invalidateQueries({ queryKey: ['conversations', apiUrl, userId] });
    },
  });
}

/**
 * Hook para eliminar una conversación
 */
export function useDeleteConversation() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: number) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return chatService.deleteConversation(apiUrl, String(userId), conversationId);
    },
    onSuccess: () => {
      // Invalidar la lista de conversaciones
      queryClient.invalidateQueries({ queryKey: ['conversations', apiUrl, userId] });
      // Invalidar todos los mensajes de conversaciones
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

/**
 * Hook para marcar una conversación como leída
 */
export function useMarkAsRead() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: number) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return chatService.markAsRead(apiUrl, String(userId), conversationId);
    },
    onSuccess: (_, conversationId: number) => {
      // Invalidar mensajes de esta conversación
      queryClient.invalidateQueries({ queryKey: ['messages', apiUrl, userId, conversationId] });
      // Invalidar la lista de conversaciones para actualizar unread_count
      queryClient.invalidateQueries({ queryKey: ['conversations', apiUrl, userId] });
    },
  });
}
