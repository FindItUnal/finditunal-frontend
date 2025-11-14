import { Avatar } from '../atoms';

export interface UserInfoProps {
  name: string;
  avatar?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserInfo({ name, avatar, subtitle, size = 'md' }: UserInfoProps) {
  const textSizes = {
    sm: { name: 'text-sm', subtitle: 'text-xs' },
    md: { name: 'text-base', subtitle: 'text-sm' },
    lg: { name: 'text-lg', subtitle: 'text-base' },
  };

  return (
    <div className="flex items-center space-x-2">
      <Avatar src={avatar} alt={name} size={size} />
      <div>
        <p className={`font-medium text-gray-700 dark:text-gray-300 ${textSizes[size].name}`}>
          {name}
        </p>
        {subtitle && (
          <p className={`text-gray-500 dark:text-gray-400 ${textSizes[size].subtitle}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
