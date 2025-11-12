import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackIcon?: boolean;
}

const sizeStyles = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

export default function Avatar({ src, alt = 'Avatar', size = 'md', fallbackIcon = true }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeStyles[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles[size]} bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center`}
    >
      {fallbackIcon && <User className={`${iconSizes[size]} text-teal-600 dark:text-teal-400`} />}
    </div>
  );
}
