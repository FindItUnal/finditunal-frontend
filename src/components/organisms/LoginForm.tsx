import { FormEvent, useState } from 'react';
import { Button, Input } from '../atoms';
import { Logo } from '../atoms';
import { Mail, Lock } from 'lucide-react';

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  isLoading?: boolean;
}

export default function LoginForm({
  onSubmit,
  onForgotPassword,
  onRegister,
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Bienvenido de nuevo
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Ingresa con tu correo institucional
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Correo institucional"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu.correo@universidad.edu"
            required
          />

          <Input
            type="password"
            label="Contraseña"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Recordarme</span>
            </label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Iniciar Sesión
          </Button>
        </form>

        {onRegister && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onRegister}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Demo: usa 'admin@universidad.edu' para rol de administrador
          </p>
        </div>
      </div>
    </div>
  );
}
