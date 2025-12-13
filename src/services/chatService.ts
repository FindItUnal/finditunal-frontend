import { apiFetch } from './api';

/**
 * Respuesta al verificar si existe una conversación
 */
export interface ConversationExistsResponse {
  exists: boolean;
  conversation_id?: number;
}

/**
 * Registro de conversación del backend
 */
export interface ConversationRecord {
  conversation_id: number;
  report_id: number;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Resumen de conversación con información adicional
 */
export interface ConversationSummary {
  conversation_id: number;
  report_id: number;
  report_title: string;
  other_user_id: string;
  other_user_name: string;
  last_message_text: string | null;
  last_message_at: string | null;
  unread_count: number;
  updated_at: string;
}

/**
 * Registro de mensaje del backend
 */
export interface MessageRecord {
  message_id: number;
  conversation_id: number;
  sender_id: string;
  message_text: string;
  is_read: number; // 0 = unread, 1 = read
  created_at: string;
}

/**
 * Payload para enviar un mensaje
 */
export interface SendMessagePayload {
  message_text: string;
}

/**
 * Servicio para operaciones de chat
 */
export const chatService = {
  /**
   * Verifica si existe una conversación para un reporte
   * GET /user/{user_id}/reports/{report_id}/conversations/exists
   */
  async checkConversationExists(
    apiBase: string,
    userId: string,
    reportId: number
  ): Promise<ConversationExistsResponse> {
    return apiFetch<ConversationExistsResponse>(
      `/user/${userId}/reports/${reportId}/conversations/exists`,
      {
        method: 'GET',
        baseUrl: apiBase,
      }
    );
  },

  /**
   * Crea o recupera una conversación para un reporte
   * POST /user/{user_id}/reports/{report_id}/conversations
   */
  async createConversation(
    apiBase: string,
    userId: string,
    reportId: number
  ): Promise<ConversationRecord> {
    return apiFetch<ConversationRecord>(
      `/user/${userId}/reports/${reportId}/conversations`,
      {
        method: 'POST',
        baseUrl: apiBase,
      }
    );
  },

  /**
   * Lista todas las conversaciones del usuario
   * GET /user/{user_id}/conversations
   */
  async getConversations(
    apiBase: string,
    userId: string
  ): Promise<ConversationSummary[]> {
    return apiFetch<ConversationSummary[]>(
      `/user/${userId}/conversations`,
      {
        method: 'GET',
        baseUrl: apiBase,
      }
    );
  },

  /**
   * Obtiene los mensajes de una conversación
   * GET /user/{user_id}/conversations/{conversation_id}/messages
   */
  async getMessages(
    apiBase: string,
    userId: string,
    conversationId: number
  ): Promise<MessageRecord[]> {
    return apiFetch<MessageRecord[]>(
      `/user/${userId}/conversations/${conversationId}/messages`,
      {
        method: 'GET',
        baseUrl: apiBase,
      }
    );
  },

  /**
   * Envía un mensaje en una conversación
   * POST /user/{user_id}/conversations/{conversation_id}/messages
   */
  async sendMessage(
    apiBase: string,
    userId: string,
    conversationId: number,
    payload: SendMessagePayload
  ): Promise<MessageRecord> {
    return apiFetch<MessageRecord>(
      `/user/${userId}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        baseUrl: apiBase,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
  },

  /**
   * Marca una conversación como leída
   * POST /user/{user_id}/conversations/{conversation_id}/read
   */
  async markAsRead(
    apiBase: string,
    userId: string,
    conversationId: number
  ): Promise<void> {
    return apiFetch<void>(
      `/user/${userId}/conversations/${conversationId}/read`,
      {
        method: 'POST',
        baseUrl: apiBase,
      }
    );
  },

  /**
   * Elimina una conversación completa
   * DELETE /user/{user_id}/conversations/{conversation_id}
   */
  async deleteConversation(
    apiBase: string,
    userId: string,
    conversationId: number
  ): Promise<void> {
    return apiFetch<void>(
      `/user/${userId}/conversations/${conversationId}`,
      {
        method: 'DELETE',
        baseUrl: apiBase,
      }
    );
  },
};
