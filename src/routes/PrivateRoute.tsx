import { Navigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function PrivateRoute({ children, requireAdmin = false }: PrivateRouteProps) {
  const user = useUserStore((s) => s.user);
  const isAuthenticated = user !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir usuarios baneados a la página de suspensión (is_active = 2 significa baneado)
  if (user?.is_active === 2) {
    return <Navigate to="/banned" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
