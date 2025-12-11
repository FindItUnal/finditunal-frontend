import { apiFetch } from './api';
import { NotificationPage } from '../types';

/**
 * Parámetros para obtener notificaciones
 */
export interface GetNotificationsParams {
  limit?: number;
  offset?: number;
  only_unread?: boolean;
}

/**
 * Servicio para gestionar notificaciones
 */
export const notificationService = {
  /**
   * Obtiene las notificaciones del usuario
   * GET /user/{user_id}/notifications
   */
  async getNotifications(
    apiBase: string,
    userId: string,
    params?: GetNotificationsParams
  ): Promise<NotificationPage> {
    const searchParams = new URLSearchParams();
    
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.only_unread) searchParams.set('only_unread', 'true');

    const query = searchParams.toString();
    const endpoint = `/user/${userId}/notifications${query ? `?${query}` : ''}`;

    const response = await apiFetch<NotificationPage>(endpoint, {
      method: 'GET',
      baseUrl: apiBase,
    });

    // Transformar is_read de número a boolean
    return {
      ...response,
      items: response.items.map(item => ({
        ...item,
        is_read: Boolean(item.is_read),
      })),
    };
  },

  /**
   * Marca una notificación como leída
   * POST /user/{user_id}/notifications/{notification_id}/read
   */
  async markAsRead(
    apiBase: string,
    userId: string,
    notificationId: number
  ): Promise<void> {
    await apiFetch<void>(
      `/user/${userId}/notifications/${notificationId}/read`,
      {
        method: 'POST',
        baseUrl: apiBase,
      }
    );
  },

  /**
   * Marca todas las notificaciones como leídas
   * POST /user/{user_id}/notifications/read-all
   */
  async markAllAsRead(
    apiBase: string,
    userId: string
  ): Promise<void> {
    await apiFetch<void>(
      `/user/${userId}/notifications/read-all`,
      {
        method: 'POST',
        baseUrl: apiBase,
      }
    );
  },
};
