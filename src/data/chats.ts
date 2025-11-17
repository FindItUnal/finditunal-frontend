import { Chat, Message } from '../types';

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
