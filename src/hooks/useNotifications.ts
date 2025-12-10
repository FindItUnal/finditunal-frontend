import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { notificationService, GetNotificationsParams } from '../services/notificationService';
import { Notification, NotificationPage } from '../types';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';

/**
 * Hook para obtener las notificaciones del usuario con paginación
 */
export function useNotifications(
  params?: GetNotificationsParams
): UseQueryResult<NotificationPage, Error> {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;

  return useQuery({
    queryKey: ['notifications', apiUrl, userId, params],
    queryFn: async () => {
      if (!userId) throw new Error('Usuario no autenticado');
      return notificationService.getNotifications(apiUrl, String(userId), params);
    },
    enabled: !!userId,
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook optimizado para obtener solo el contador de notificaciones no leídas
 */
export function useUnreadNotificationsCount(): UseQueryResult<{ unread_count: number }, Error> {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;

  return useQuery({
    queryKey: ['notificationsUnreadCount', apiUrl, userId],
    queryFn: async () => {
      if (!userId) throw new Error('Usuario no autenticado');
      const data = await notificationService.getNotifications(apiUrl, String(userId), {
        limit: 1,
        only_unread: true,
      });
      return { unread_count: data.unread_count };
    },
    enabled: !!userId,
    staleTime: 15000, // 15 segundos
    refetchInterval: 30000, // Refetch cada 30 segundos
  });
}

/**
 * Hook para marcar una notificación como leída
 */
export function useMarkNotificationAsRead() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: number) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return notificationService.markAsRead(apiUrl, String(userId), notificationId);
    },
    onMutate: async (notificationId: number) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot del estado anterior
      const previousNotifications = queryClient.getQueryData(['notifications', apiUrl, userId]);

      // Actualización optimista
      queryClient.setQueriesData(
        { queryKey: ['notifications', apiUrl, userId] },
        (old: NotificationPage | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item: Notification) =>
              item.notification_id === notificationId
                ? { ...item, is_read: true }
                : item
            ),
            unread_count: Math.max(0, old.unread_count - 1),
          };
        }
      );

      return { previousNotifications };
    },
    onError: (_err, _notificationId, context) => {
      // Revertir cambios optimistas en caso de error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications', apiUrl, userId],
          context.previousNotifications
        );
      }
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['notifications', apiUrl, userId] });
      queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount', apiUrl, userId] });
    },
  });
}

/**
 * Hook para marcar todas las notificaciones como leídas
 */
export function useMarkAllNotificationsAsRead() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const userId = user ? getUserId(user) : null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Usuario no autenticado');
      return notificationService.markAllAsRead(apiUrl, String(userId));
    },
    onMutate: async () => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      // Snapshot del estado anterior
      const previousNotifications = queryClient.getQueryData(['notifications', apiUrl, userId]);

      // Actualización optimista
      queryClient.setQueriesData(
        { queryKey: ['notifications', apiUrl, userId] },
        (old: NotificationPage | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item: Notification) => ({ ...item, is_read: true })),
            unread_count: 0,
          };
        }
      );

      return { previousNotifications };
    },
    onError: (_err, _variables, context) => {
      // Revertir cambios optimistas en caso de error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications', apiUrl, userId],
          context.previousNotifications
        );
      }
    },
    onSuccess: () => {
      // Invalidar todas las queries de notificaciones
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
    },
  });
}
