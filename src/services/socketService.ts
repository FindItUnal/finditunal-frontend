import { io, Socket } from 'socket.io-client';

interface MessageData {
  conversation_id: number;
  message_id: number;
  sender_id: number;
  message_text: string;
  created_at: string;
}

interface NotificationData {
  type: string;
  conversation_id: number;
  message_id: number;
  from_user_id: number;
  created_at: string;
}

class SocketService {
  private socket: Socket | null = null;

  connect(apiUrl: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }
    
    // Conectar con las cookies de autenticación
    this.socket = io(apiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO conectado');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO desconectado:', reason);
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket.IO error:', error.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Unirse a una conversación
  joinConversation(conversationId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('conversation:join', { conversation_id: conversationId });
  }

  // Salir de una conversación
  leaveConversation(conversationId: number): void {
    if (!this.socket?.connected) return;
    this.socket.emit('conversation:leave', { conversation_id: conversationId });
  }

  // Enviar mensaje (alternativa a REST API)
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

  // Listeners para eventos
  onNewMessage(callback: (message: MessageData) => void): void {
    if (!this.socket) return;
    this.socket.on('message:new', callback);
  }

  onNewNotification(callback: (notification: NotificationData) => void): void {
    if (!this.socket) return;
    this.socket.on('notification:new', callback);
  }

  // Remover listeners
  offNewMessage(): void {
    if (!this.socket) return;
    this.socket.off('message:new');
  }

  offNewNotification(): void {
    if (!this.socket) return;
    this.socket.off('notification:new');
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Exportar instancia singleton
export const socketService = new SocketService();
export type { MessageData, NotificationData };
