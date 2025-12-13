import { NavLink, useNavigate } from 'react-router-dom';
import { Package, MessageCircle, Bell, User, Users, LogOut, Menu, X } from 'lucide-react';
import ThemeToggle from '../atoms/ThemeToggle';
import ConfirmDialog from '../molecules/ConfirmDialog';
import unalIcon from '../../assets/icon_unal.svg';
import { useState } from 'react';
import useUserStore from '../../store/useUserStore';
import useGlobalStore from '../../store/useGlobalStore';
import icon_page from '/icon_page.svg';

export interface HeaderProps {
  unreadMessageCount?: number;
  unreadNotificationsCount?: number;
}

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `p-2 rounded-md flex items-center space-x-2 transition-colors ${
    isActive
      ? 'bg-teal-600 text-white shadow'
      : 'text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
  }`;

export default function Header({ unreadMessageCount = 0, unreadNotificationsCount = 0 }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const user = useUserStore((s) => s.user);
  const logoutFromStore = useUserStore((s) => s.logout);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutFromStore(apiUrl, navigate);
    setLogoutDialogOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <NavLink to="/dashboard" className="flex items-center space-x-2">
              <div className="w-[50px] h-[50px] overflow-hidden rounded-sm flex items-center justify-center">
                <img src={icon_page} alt="Publicaciones" className="w-full h-full object-contain object-center" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white !ml-0">FindIt</span>
              <div className="w-[65px] h-[60px] flex items-start justify-start overflow-hidden rounded-md">
                <img src={unalIcon} alt="Unal" className="min-w-full min-h-full object-cover" />
              </div>
            </NavLink>
          </div>

          {/* desktop nav */}
          <div className="hidden md:flex items-center space-x-3">
            <NavLink to="/dashboard" className={navItemClass}>
              <Package className="w-5 h-5" />
            </NavLink>

            <NavLink to="/messages" className={navItemClass}>
              <div className="relative inline-flex items-center">
                <MessageCircle className="w-5 h-5" />
                {unreadMessageCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-800" title={`${unreadMessageCount} mensaje${unreadMessageCount > 1 ? 's' : ''} no leído${unreadMessageCount > 1 ? 's' : ''}`}></span>
                )}
              </div>
            </NavLink>

            <NavLink to="/notifications" className={navItemClass}>
              <div className="relative inline-flex items-center">
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-gray-800" title={`${unreadNotificationsCount} notificación${unreadNotificationsCount > 1 ? 'es' : ''} no leída${unreadNotificationsCount > 1 ? 's' : ''}`}></span>
                )}
              </div>
            </NavLink>

            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navItemClass}>
                <Users className="w-5 h-5" />
                <span className="hidden lg:inline">Admin</span>
              </NavLink>
            )}

            <ThemeToggle />
            <NavLink to="/profile" className={navItemClass}>
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">Perfil</span>
            </NavLink>

            <button 
              onClick={() => setLogoutDialogOpen(true)} 
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* mobile controls */}
          <div className="flex md:hidden items-center">
            <ThemeToggle />
            <button 
              onClick={() => setMobileOpen((s) => !s)} 
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-teal-600 text-white flex items-center space-x-2' : 'px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 flex items-center space-x-2'} 
                onClick={() => setMobileOpen(false)}
              >
                <Package className="w-5 h-5" />
                <span>Publicaciones</span>
              </NavLink>

              <NavLink 
                to="/messages" 
                className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-teal-600 text-white flex items-center space-x-2' : 'px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 flex items-center space-x-2'} 
                onClick={() => setMobileOpen(false)}
              >
                <div className="relative">
                  <MessageCircle className="w-5 h-5" />
                  {unreadMessageCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                  )}
                </div>
                <span>Mensajes</span>
              </NavLink>

              <NavLink 
                to="/notifications" 
                className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-teal-600 text-white flex items-center space-x-2' : 'px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 flex items-center space-x-2'} 
                onClick={() => setMobileOpen(false)}
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
                  )}
                </div>
                <span>Notificaciones</span>
              </NavLink>

              <NavLink 
                to="/profile" 
                className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-teal-600 text-white flex items-center space-x-2' : 'px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 flex items-center space-x-2'} 
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </NavLink>

              {user?.role === 'admin' && (
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => isActive ? 'px-3 py-2 rounded-md bg-teal-600 text-white flex items-center space-x-2' : 'px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 flex items-center space-x-2'} 
                  onClick={() => setMobileOpen(false)}
                >
                  <Users className="w-5 h-5" />
                  <span>Admin</span>
                </NavLink>
              )}

              <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                <button 
                  onClick={() => {
                    setLogoutDialogOpen(true);
                    setMobileOpen(false);
                  }} 
                  className="w-full px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Cerrar sesión"
        description="¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a autenticarte para acceder."
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
        onConfirm={handleLogout}
      />
    </nav>
  );
}
