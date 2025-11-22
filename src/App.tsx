import { ThemeProvider } from './context/ThemeContext';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import useUserStore from './store/useUserStore';

function AppContent() {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const isLoading = useUserStore((s) => s.isLoading);
  const setLoading = useUserStore((s) => s.setLoading);

  // Cargar perfil desde backend solo si hay cookies pero NO hay user en Zustand
  useEffect(() => {
    const loadProfile = async () => {
      // Si ya hay user en Zustand (persistido), no hacer fetch
      if (user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const resp = await fetch(`${apiBase.replace(/\/$/, '')}/user/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        // Solo setear user si la respuesta es exitosa
        // Si es 401 (Unauthorized), es normal - usuario no está logueado
        if (resp.ok) {
          const data = await resp.json();
          setUser(data);
        }
        // No hacer nada si falla - el usuario simplemente no está autenticado
      } catch (error) {
        // Silenciar errores de red - el usuario permanece no autenticado
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // No renderizar rutas hasta que termine la carga inicial
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
