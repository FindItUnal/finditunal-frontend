/**
 * DATOS MOCK - PENDIENTE INTEGRACIÓN CON BACKEND
 * 
 * TODO: Reemplazar con integración real cuando el backend de mensajería esté disponible:
 * - Implementar chatService.getChats() para obtener conversaciones del usuario
 * - Implementar chatService.getMessages(chatId) para obtener mensajes de una conversación
 * - Implementar chatService.sendMessage(chatId, content) para enviar mensajes
 * - Implementar WebSocket para mensajes en tiempo real
 * 
 * @see MessagesPage.tsx - Página que consume estos datos
 * @see HeaderResponsive.tsx / Layout.tsx - Usan mockChats para el contador de no leídos
 */

import { Chat, Message } from '../types';

/**
 * Conversaciones mock para desarrollo
 * @deprecated Usar chatService cuando esté disponible
 */
export const mockChats: Chat[] = [
  {
    id: '1',
    participantId: '2',
    participantName: 'María García',
    lastMessage: 'Hola, ¿todavía tienes el iPhone?',
    lastMessageTime: '2025-10-23T10:30:00Z',
    unreadCount: 2,
  },
  {
    id: '2',
    participantId: '3',
    participantName: 'Carlos Ruiz',
    lastMessage: 'Gracias por encontrar mi mochila',
    lastMessageTime: '2025-10-23T09:15:00Z',
    unreadCount: 0,
  },
  {
    id: '3',
    participantId: '4',
    participantName: 'Ana López',
    lastMessage: '¿Puedo recogerla hoy?',
    lastMessageTime: '2025-10-22T16:45:00Z',
    unreadCount: 1,
  },
];

/**
 * Mensajes mock para desarrollo
 * @deprecated Usar chatService cuando esté disponible
 */
export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'María García',
    content: 'Hola, vi tu publicación del iPhone',
    timestamp: '2025-10-23T10:25:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'Tú',
    content: 'Hola María, sí todavía lo tengo',
    timestamp: '2025-10-23T10:27:00Z',
    read: true,
  },
  {
    id: '3',
    senderId: '2',
    senderName: 'María García',
    content: 'Hola, ¿todavía tienes el iPhone?',
    timestamp: '2025-10-23T10:30:00Z',
    read: false,
  },
];

export default { mockChats, mockMessages };
