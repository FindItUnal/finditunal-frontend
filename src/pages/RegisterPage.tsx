import { useNavigate } from 'react-router-dom';
import { AuthTemplate } from '../components/templates';
import { Button, Input, Logo } from '../components/atoms';
import { Mail, Lock, User } from 'lucide-react';
import ThemeToggle from '../components/atoms/ThemeToggle';
import { useAuth } from '../hooks';
import { useState, FormEvent } from 'react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Usar login en lugar de crear un registro separado
    login(formData.email, formData.password);
  };

  return (
    <AuthTemplate onBack={() => navigate('/')}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Crear una cuenta
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Únete a nuestra comunidad universitaria
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Nombre completo"
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Juan Pérez"
              required
            />

            <Input
              type="email"
              label="Correo institucional"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu.correo@universidad.edu"
              required
            />

            <Input
              type="password"
              label="Contraseña"
              icon={Lock}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
            />

            <Input
              type="password"
              label="Confirmar contraseña"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
            />

            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                required
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Acepto los{' '}
                <button type="button" className="text-teal-600 dark:text-teal-400 hover:underline">
                  términos y condiciones
                </button>
              </span>
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthTemplate>
  );
}
