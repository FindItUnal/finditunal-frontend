import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

interface BackButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export default function BackButton({ to, children, className }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`mb-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center ${className ?? ''}`}
    >
      <ArrowLeft className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
      {children}
    </button>
  );
}
