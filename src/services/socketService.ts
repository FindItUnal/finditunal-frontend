import { io, Socket } from 'socket.io-client';

export interface MessageData {
  conversation_id: number;
  message_id: number;
  sender_id: string;
  message_text: string;
  created_at: string;
}

export interface NotificationData {
  type: string;
  conversation_id: number;
  message_id: number;
  from_user_id: string;
  created_at: string;
}

export interface ConversationReadData {
  conversation_id: number;
  user_id: string;
}

type MessageCallback = (message: MessageData) => void;
type NotificationCallback = (notification: NotificationData) => void;
type ConversationReadCallback = (data: ConversationReadData) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageCallbacks: Set<MessageCallback> = new Set();
  private notificationCallbacks: Set<NotificationCallback> = new Set();
  private conversationReadCallbacks: Set<ConversationReadCallback> = new Set();

  connect(apiUrl: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Desconectar socket anterior si existe pero no está conectado
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Conectar con las cookies de autenticación
    this.socket = io(apiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO conectado');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO desconectado:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO error de conexión:', error.message);
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket.IO error:', error.message);
    });

    // Configurar listener central para nuevos mensajes
    this.socket.on('message:new', (message: MessageData) => {
      this.messageCallbacks.forEach((callback) => callback(message));
    });

    // Configurar listener central para notificaciones
    this.socket.on('notification:new', (notification: NotificationData) => {
      this.notificationCallbacks.forEach((callback) => callback(notification));
    });

    // Configurar listener central para conversaciones leídas
    this.socket.on('conversation:read', (data: ConversationReadData) => {
      this.conversationReadCallbacks.forEach((callback) => callback(data));
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    // Limpiar callbacks
    this.messageCallbacks.clear();
    this.notificationCallbacks.clear();
    this.conversationReadCallbacks.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Unirse a una conversación (room)
  joinConversation(conversationId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('conversation:join', { conversation_id: conversationId });
  }

  // Salir de una conversación (room)
  leaveConversation(conversationId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('conversation:leave', { conversation_id: conversationId });
  }

  // Enviar mensaje via Socket.IO
  sendMessage(conversationId: number, messageText: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit('message:send', {
      conversation_id: conversationId,
      message_text: messageText,
    });
  }

  // Marcar conversación como leída
  markAsRead(conversationId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('conversation:read', { conversation_id: conversationId });
  }

  // Suscribirse a nuevos mensajes
  onNewMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    // Retornar función de cleanup
    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  // Suscribirse a notificaciones
  onNewNotification(callback: NotificationCallback): () => void {
    this.notificationCallbacks.add(callback);
    return () => {
      this.notificationCallbacks.delete(callback);
    };
  }

  // Suscribirse a eventos de conversación leída
  onConversationRead(callback: ConversationReadCallback): () => void {
    this.conversationReadCallbacks.add(callback);
    return () => {
      this.conversationReadCallbacks.delete(callback);
    };
  }

  // Métodos legacy para compatibilidad (deprecated)
  offNewMessage(): void {
    // No hace nada - usar el cleanup retornado por onNewMessage
  }

  offNewNotification(): void {
    // No hace nada - usar el cleanup retornado por onNewNotification
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Exportar instancia singleton
export const socketService = new SocketService();
