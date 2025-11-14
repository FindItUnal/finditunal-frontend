import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import IconButton from '../atoms/IconButton';
import { FC } from 'react';

export interface NotificationsButtonProps {
  count?: number;
  className?: string;
}

const NotificationsButton: FC<NotificationsButtonProps> = ({ count = 0, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/notifications');
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <IconButton
        icon={Bell}
        variant="secondary"
        size="md"
        ariaLabel="Notificaciones"
        onClick={handleClick}
      />

      {/* badge */}
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default NotificationsButton;
