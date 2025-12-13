import { Package, MessageCircle, AlertTriangle, Settings } from 'lucide-react';
import { Notification, NotificationType } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
}

const notificationConfig: Record<NotificationType, { icon: typeof Package; bgColor: string; iconColor: string }> = {
  system: {
    icon: Settings,
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  report: {
    icon: Package,
    bgColor: 'bg-teal-100 dark:bg-teal-900',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  complaint: {
    icon: AlertTriangle,
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  message: {
    icon: MessageCircle,
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
};

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
  };

  const formattedTime = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: es,
  });

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 flex gap-3 border-b border-gray-200 dark:border-gray-700
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer
                  ${!notification.is_read ? 'bg-teal-50/30 dark:bg-teal-900/10' : ''}`}
    >
      {/* Icono */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgColor}`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-start justify-between gap-2 mb-1">
          {/* Título */}
          <h4
            className={`font-semibold text-sm ${
              notification.is_read
                ? 'text-gray-600 dark:text-gray-400'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {notification.title}
          </h4>

          {/* Indicador no leído */}
          {!notification.is_read && (
            <span
              className="w-2.5 h-2.5 bg-teal-500 rounded-full flex-shrink-0 mt-1"
              title="No leída"
            />
          )}
        </div>

        {/* Mensaje opcional */}
        {notification.message && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
            {notification.message}
          </p>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {formattedTime}
        </p>
      </div>
    </button>
  );
}
