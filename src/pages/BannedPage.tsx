import { useNavigate } from 'react-router-dom';
import { ShieldX, Mail, LogOut, Home } from 'lucide-react';
import { AuthTemplate } from '../components/templates';
import ThemeToggle from '../components/atoms/ThemeToggle';
import { Button, Logo } from '../components/atoms';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';

export default function BannedPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const setUser = useUserStore((s) => s.setUser);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const handleLogout = async () => {
    await logout(apiUrl, navigate);
  };

  const handleGoHome = () => {
    // Limpiar cualquier dato de usuario que pueda existir
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <AuthTemplate>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          {/* Icono de advertencia */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <ShieldX className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Cuenta Suspendida
          </h1>

          {/* Mensaje principal */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Tu cuenta ha sido suspendida debido a una violación de las normas de uso de la plataforma.
          </p>

          {/* Información del usuario */}
          {user && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Razones posibles */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
              Posibles razones de suspensión:
            </h3>
            <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
              <li>• Publicación de contenido inapropiado</li>
              <li>• Comportamiento abusivo hacia otros usuarios</li>
              <li>• Uso fraudulento de la plataforma</li>
              <li>• Múltiples denuncias verificadas</li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Si crees que esto es un error, puedes contactar al equipo de soporte:
            </p>
            <a
              href="mailto:soporte@findit.unal.edu.co"
              className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
            >
              <Mail className="w-4 h-4" />
              soporte@findit.unal.edu.co
            </a>
          </div>

          {/* Botón de cerrar sesión o volver al inicio */}
          {user ? (
            <Button
              onClick={handleLogout}
              variant="secondary"
              fullWidth
              icon={LogOut}
            >
              Cerrar Sesión
            </Button>
          ) : (
            <Button
              onClick={handleGoHome}
              variant="secondary"
              fullWidth
              icon={Home}
            >
              Volver al Inicio
            </Button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          FindIt UNAL © {new Date().getFullYear()} - Todos los derechos reservados
        </p>
      </div>
    </AuthTemplate>
  );
}
