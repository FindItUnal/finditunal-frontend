import { ReactNode } from 'react';

export interface ModalTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export default function ModalTemplate({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
}: ModalTemplateProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <style>
        {`.modal-scroll::-webkit-scrollbar{width:8px;height:8px}.modal-scroll::-webkit-scrollbar-track{background:transparent}.modal-scroll::-webkit-scrollbar-thumb{background-color:#0d9488;border-radius:9999px}.modal-scroll{scrollbar-width:thin;scrollbar-color:#0d9488 transparent}`}
      </style>
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ${sizeStyles[size]} w-full max-h-[90vh] overflow-y-auto modal-scroll`}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
