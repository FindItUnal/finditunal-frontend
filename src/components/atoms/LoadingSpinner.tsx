export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Optional message to display below the spinner */
  message?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to center the spinner in its container */
  centered?: boolean;
}

const sizeStyles = {
  sm: 'w-8 h-8 border-2',
  md: 'w-16 h-16 border-4',
  lg: 'w-24 h-24 border-4',
};

export default function LoadingSpinner({
  size = 'md',
  message,
  className = '',
  centered = true,
}: LoadingSpinnerProps) {
  const containerClass = centered ? 'flex items-center justify-center py-12' : '';
  
  return (
    <div className={`${containerClass} ${className}`}>
      <div className="text-center">
        <div
          className={`${sizeStyles[size]} border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}
          role="status"
          aria-label="Cargando"
        />
        {message && (
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
}

