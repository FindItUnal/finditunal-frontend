import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { PageTemplate } from '../components/templates';
import { Card, Button, LoadingSpinner } from '../components/atoms';
import { EmptyState } from '../components/organisms';
import NotificationItem from '../components/molecules/NotificationItem';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../hooks/useNotifications';
import { Notification } from '../types';
import useUserStore from '../store/useUserStore';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Obtener notificaciones
  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useNotifications({
    limit: 50,
    only_unread: filter === 'unread',
  });

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.items ?? [];
  const unreadCount = notificationsData?.unread_count ?? 0;

  const handleNotificationClick = async (notification: Notification) => {
    // Marcar como leída si no lo está
    if (!notification.is_read) {
      try {
        await markAsReadMutation.mutateAsync(notification.notification_id);
      } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
      }
    }

    // Navegar según el tipo y related_id
    switch (notification.type) {
      case 'message':
        if (notification.related_id) {
          navigate(`/messages/${notification.related_id}`);
        } else {
          navigate('/messages');
        }
        break;

      case 'report':
        if (notification.related_id) {
          navigate(`/object/${notification.related_id}`);
        } else {
          navigate('/dashboard');
        }
        break;

      case 'complaint':
        if (user?.role === 'admin') {
          navigate('/admin/reports');
        }
        break;

      case 'system':
        // Para notificaciones del sistema, no navegar
        break;
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      await markAllAsReadMutation.mutateAsync();
      console.log('✅ Todas las notificaciones marcadas como leídas');
      refetch();
    } catch (error) {
      console.error('❌ Error al marcar todas las notificaciones como leídas:', error);
    }
  };

  // Scroll to top al montar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <PageTemplate>
        <LoadingSpinner message="Cargando notificaciones..." />
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <Card padding="none" className="overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notificaciones
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filtros */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Todas
                </Button>
                <Button
                  variant={filter === 'unread' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  No leídas {unreadCount > 0 && `(${unreadCount})`}
                </Button>
              </div>

              {/* Marcar todas como leídas */}
              {unreadCount > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                >
                  {markAllAsReadMutation.isPending ? 'Marcando...' : 'Marcar todas como leídas'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Lista de notificaciones */}
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No tienes notificaciones'}
            description={
              filter === 'unread'
                ? 'Todas tus notificaciones han sido leídas'
                : 'Cuando recibas notificaciones aparecerán aquí'
            }
          />
        ) : (
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto activity-scroll divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.notification_id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        )}
      </Card>
    </PageTemplate>
  );
}
