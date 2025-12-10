import { useEffect, useState } from 'react';
import { X, Package, MessageCircle, AlertTriangle, Settings } from 'lucide-react';
import { NotificationType } from '../../types';

export interface NotificationToastProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const typeConfig = {
  message: {
    icon: MessageCircle,
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-600',
  },
  report: {
    icon: Package,
    bgClass: 'bg-cyan-500',
    borderClass: 'border-cyan-600',
  },
  complaint: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-600',
  },
  system: {
    icon: Settings,
    bgClass: 'bg-teal-500',
    borderClass: 'border-teal-600',
  },
};

export default function NotificationToast({
  message,
  type,
  onClose,
  duration = 5000,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    // Animación de entrada
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto-cerrar después de duration
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Esperar a que termine la animación de salida
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 w-full max-w-sm
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-l-4
          ${config.borderClass}
          overflow-hidden
        `}
      >
        <div className="p-4 flex items-start space-x-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgClass} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Nueva notificación
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full ${config.bgClass} transition-all ease-linear`}
            style={{
              width: isVisible ? '0%' : '100%',
              transitionDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
