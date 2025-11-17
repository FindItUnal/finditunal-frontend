import { ReactNode } from 'react';

export interface PageTemplateProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageTemplate({ children, title, subtitle, actions }: PageTemplateProps) {
  return (
    <div className="relative min-h-screen bg-transparent dark:bg-gray-900 transition-colors">
      {/* Decorative animated blobs for light mode */}
      <div className="absolute inset-0 overflow-hidden dark:hidden -z-10" aria-hidden="true">
        <div className="absolute top-4/4 left-[10%] w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-2/4 right-3/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-3/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        <div className="absolute top-[10%] right-1/4 w-32 h-32 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-3000"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || subtitle || actions) && (
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
