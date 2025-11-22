import { Search, Package, MessageCircle, Shield, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/atoms/ThemeToggle';
import { Button } from '../components/atoms';
import unalIcon from '../assets/icon_unal.svg';
import useUserStore from '../store/useUserStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const isAuthenticated = user !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">FindIt</span>
              <div className="w-[65px] h-[60px] flex items-start justify-start overflow-hidden rounded-md">
                <img src={unalIcon} alt="Unal" className="min-w-full min-h-full object-cover" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
                >
                  Ir al Dashboard
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Encuentra lo que <span className="text-teal-600 dark:text-teal-400">perdiste</span>
              <br />
              o ayuda a <span className="text-teal-600 dark:text-teal-400">otros</span> a encontrar
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Plataforma universitaria para reportar y encontrar objetos perdidos. Conecta con tu comunidad y recupera lo que más importa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
                  className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Ir al Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Comenzar Ahora
                </button>
              )}
            
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 py-20 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">¿Cómo funciona?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Simple, rápido y seguro</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 transition-all hover:shadow-xl transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-teal-600 dark:bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Busca</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Filtra por categoría, ubicación o fecha para encontrar tu objeto perdido rápidamente.
                </p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 transition-all hover:shadow-xl transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-cyan-600 dark:bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Publica</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  ¿Encontraste algo? Súbelo con foto y descripción para que su dueño lo encuentre.
                </p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 transition-all hover:shadow-xl transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Conecta</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comunícate directamente con quien encontró o perdió el objeto de forma segura.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Características principales</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <Shield className="w-12 h-12 text-teal-600 dark:text-teal-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Seguro y Confiable</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Acceso exclusivo con correo institucional. Tu información está protegida.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <MessageCircle className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Chat Integrado</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comunícate directamente sin compartir tu información personal.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <Search className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Búsqueda Avanzada</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Filtros inteligentes por categoría, ubicación, fecha y palabras clave.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <TrendingUp className="w-12 h-12 text-teal-600 dark:text-teal-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Notificaciones</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Recibe alertas cuando alguien reclame tu publicación o te envíe un mensaje.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <Users className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Comunidad Activa</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Únete a una red universitaria comprometida con ayudarse mutuamente.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700">
                <Package className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Gestión Fácil</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Administra tus publicaciones y edita o elimina reportes fácilmente.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 py-20 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">¿Listo para empezar?</h2>
            <p className="text-xl text-teal-50 mb-10">
              Únete a nuestra comunidad y ayuda a recuperar objetos perdidos en tu universidad.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-white hover:bg-gray-100 text-teal-600 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              Iniciar con Google
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Package className="w-8 h-8 text-teal-400" />
              <span className="text-xl font-bold">FindIt</span>
              <div className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-md">
                <img src={unalIcon} alt="Unal" className="min-w-full min-h-full object-cover" />
              </div>
            </div>
            <p className="text-gray-400">© 2025 FindIt. Sistema de Objetos Perdidos Universitario.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
