import { useNavigate } from 'react-router-dom';
import { AuthTemplate } from '../components/templates';
import ThemeToggle from '../components/atoms/ThemeToggle';
import { Button } from '../components/atoms';
import { Logo } from '../components/atoms';

export default function LoginPage() {
  const navigate = useNavigate();

  const startGoogleAuth = () => {
    // Use explicit backend host as fallback to avoid SPA routing interception
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = import.meta.env.VITE_GOOGLE_AUTH_URL || `${apiBase.replace(/\/$/, '')}/auth/google`;
    // Redirect the browser to the Google OAuth entrypoint (backend)
    window.location.href = url;
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
            Inicia sesión con Google
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Selecciona tu cuenta institucional para acceder.
          </p>

          <div className="space-y-4">
            <Button onClick={startGoogleAuth} variant="primary" fullWidth>
              Iniciar sesión con Google
            </Button>
            <Button onClick={() => navigate('/')} variant="ghost" fullWidth>
              Volver
            </Button>
          </div>
        </div>
      </div>
    </AuthTemplate>
  );
}
