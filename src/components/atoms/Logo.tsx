import { Package } from 'lucide-react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeStyles = {
  sm: { icon: 'w-6 h-6', text: 'text-lg' },
  md: { icon: 'w-8 h-8', text: 'text-2xl' },
  lg: { icon: 'w-12 h-12', text: 'text-3xl' },
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const styles = sizeStyles[size];

  return (
    <div className="flex items-center space-x-2">
      <Package className={`${styles.icon} text-teal-600 dark:text-teal-400`} />
      {showText && (
        <span className={`${styles.text} font-bold text-gray-900 dark:text-white`}>
          FindIt
        </span>
      )}
    </div>
  );
}
