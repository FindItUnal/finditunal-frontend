import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import NotificationToast from '../components/molecules/NotificationToast';
import { NotificationType } from '../types';

interface Toast {
  id: number;
  message: string;
  type: NotificationType;
  conversationId?: number;
  onClick?: () => void;
}

interface NotificationToastContextValue {
  showNotification: (message: string, type: NotificationType, conversationId?: number, onClick?: () => void) => void;
}

const NotificationToastContext = createContext<NotificationToastContextValue | undefined>(undefined);

let toastIdCounter = 0;

export function NotificationToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType, conversationId?: number, onClick?: () => void) => {
    const id = toastIdCounter++;
    setToasts((prev) => [...prev, { id, message, type, conversationId, onClick }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <NotificationToastContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Render toasts */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
        <div className="space-y-4 pointer-events-auto">
          {toasts.map((toast) => (
            <NotificationToast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              conversationId={toast.conversationId}
              onClick={toast.onClick}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </NotificationToastContext.Provider>
  );
}

export function useNotificationToast() {
  const context = useContext(NotificationToastContext);
  if (!context) {
    throw new Error('useNotificationToast must be used within NotificationToastProvider');
  }
  return context;
}
