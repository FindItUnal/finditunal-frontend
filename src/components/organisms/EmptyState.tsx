import { Package } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon = Package,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
