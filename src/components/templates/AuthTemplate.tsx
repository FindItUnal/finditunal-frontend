import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../atoms';

export interface AuthTemplateProps {
  children: ReactNode;
  onBack?: () => void;
}

export default function AuthTemplate({ children, onBack }: AuthTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      {onBack && (
        <div className="absolute top-8 left-8">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Volver al inicio
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}
