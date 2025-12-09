import {
  Package,
  Users,
  AlertCircle,
  TrendingUp,
  User as UserIcon,
  RefreshCw,
  FileText,
  MessageSquare,
  Ban,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '../components/templates';
import { Card, Button } from '../components/atoms';
import useUserStore from '../store/useUserStore';
import { useAdminDashboardStats, useAdminActivityLog } from '../hooks';
import { ActivityLogRecord } from '../types';

/**
 * Formatea una fecha a un texto relativo (hace X minutos, etc.)
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'Hace un momento';
  } else if (diffMinutes < 60) {
    return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else {
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Obtiene el icono y colores según el tipo de evento
 */
function getActivityStyle(activity: ActivityLogRecord) {
  const targetType = activity.target_type.toLowerCase();
  const eventType = activity.event_type.toLowerCase();

  // Usuario: registro, login, actualización de perfil
  if (targetType === 'user' || eventType.includes('user') || eventType.includes('login') || eventType.includes('register')) {
    return {
      icon: UserIcon,
      bgClass: 'bg-teal-100 dark:bg-teal-900',
      iconClass: 'text-teal-600 dark:text-teal-400',
    };
  }

  // Reportes/Objetos: creación, actualización, entrega
  if (targetType === 'report' || targetType === 'object' || eventType.includes('report') || eventType.includes('object')) {
    return {
      icon: Package,
      bgClass: 'bg-cyan-100 dark:bg-cyan-900',
      iconClass: 'text-cyan-600 dark:text-cyan-400',
    };
  }

  // Denuncias/Complaints
  if (targetType === 'complaint' || eventType.includes('complaint') || eventType.includes('denuncia')) {
    return {
      icon: AlertCircle,
      bgClass: 'bg-amber-100 dark:bg-amber-900',
      iconClass: 'text-amber-600 dark:text-amber-400',
    };
  }

  // Mensajes/Chat
  if (targetType === 'message' || targetType === 'conversation' || eventType.includes('message')) {
    return {
      icon: MessageSquare,
      bgClass: 'bg-purple-100 dark:bg-purple-900',
      iconClass: 'text-purple-600 dark:text-purple-400',
    };
  }

  // Baneo de usuario
  if (eventType.includes('ban') || eventType.includes('suspend')) {
    return {
      icon: Ban,
      bgClass: 'bg-red-100 dark:bg-red-900',
      iconClass: 'text-red-600 dark:text-red-400',
    };
  }

  // Default: documento genérico
  return {
    icon: FileText,
    bgClass: 'bg-gray-100 dark:bg-gray-700',
    iconClass: 'text-gray-600 dark:text-gray-400',
  };
}

// Componente skeleton para estadísticas del mes
const MonthStatsSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i}>
        <div className="flex justify-between mb-2">
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// Obtener el nombre del mes actual
function getCurrentMonthName(): string {
  return new Date().toLocaleDateString('es-ES', { month: 'long' });
}

// Componente skeleton para métricas en carga
const MetricSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-gray-300 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
    <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
    <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
  </div>
);

// Componente skeleton para actividad en carga
const ActivitySkeleton = () => (
  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
    <div className="flex-1">
      <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="w-1/4 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();
  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useAdminDashboardStats();
  const { 
    activities, 
    isLoading: activitiesLoading, 
    error: activitiesError, 
    refetch: refetchActivities,
    hasMore,
    loadMore,
  } = useAdminActivityLog(10);

  const handleRefreshAll = async () => {
    await Promise.all([refetchStats(), refetchActivities()]);
  };

  const isLoading = statsLoading || activitiesLoading;
  const error = statsError || activitiesError;

  return (
    <PageTemplate>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona usuarios, publicaciones y reportes del sistema
          </p>
        </div>
        <button
          onClick={handleRefreshAll}
          disabled={isLoading}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors disabled:opacity-50"
          title="Actualizar todo"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={handleRefreshAll}
            className="mt-2 text-sm text-red-700 dark:text-red-300 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-teal-600 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-12 h-12 text-teal-600 dark:text-teal-400" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.total_users ?? 0}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Total Usuarios</h3>
              <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">
                +{stats?.new_users_last_7_days ?? 0} esta semana
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-cyan-600 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.total_reports ?? 0}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">
                Objetos Publicados
              </h3>
              <p className="text-sm text-cyan-600 dark:text-cyan-400 mt-2">
                +{stats?.reports_today ?? 0} hoy
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-amber-600 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.active_complaints ?? 0}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">Denuncias Activas</h3>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                Requieren atención
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-600 transition-all hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-12 h-12 text-green-600 dark:text-green-400" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.recovered_reports_current_month ?? 0}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">
                Objetos Recuperados
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">Este mes</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Actividad Reciente
            </h2>
            <div className="space-y-4">
              {activitiesLoading && activities.length === 0 ? (
                <>
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                  <ActivitySkeleton />
                </>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No hay actividad reciente registrada
                </div>
              ) : (
                <>
                  {activities.map((activity) => {
                    const style = getActivityStyle(activity);
                    const IconComponent = style.icon;

                    return (
                      <div
                        key={activity.activity_id}
                        className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${style.bgClass}`}
                        >
                          <IconComponent className={`w-5 h-5 ${style.iconClass}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-white font-medium">
                            {activity.title}
                          </p>
                          {activity.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                              {activity.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatRelativeTime(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {hasMore && (
                    <button
                      onClick={loadMore}
                      disabled={activitiesLoading}
                      className="w-full py-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-50"
                    >
                      {activitiesLoading ? 'Cargando...' : 'Ver más actividad'}
                    </button>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <Button
                variant="primary"
                icon={Users}
                onClick={() => navigate('/admin/users')}
                className="w-full"
              >
                Gestionar Usuarios
              </Button>
              <button
                onClick={() => navigate('/admin/reports')}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>Ver Denuncias</span>
              </button>
            </div>
          </Card>

          <div className="bg-gradient-to-br from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-xl shadow-md p-6 text-white transition-colors">
            <h3 className="text-lg font-bold mb-2">Bienvenido, {user?.name}</h3>
            <p className="text-teal-50 text-sm mb-4">
              Estás conectado como administrador del sistema
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistema operando normalmente</span>
            </div>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Estadísticas del Mes
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {getCurrentMonthName()}
              </span>
            </div>
            
            {statsLoading ? (
              <MonthStatsSkeleton />
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tasa de recuperación
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {stats?.recovery_rate_current_month ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(stats?.recovery_rate_current_month ?? 0, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stats?.recovered_reports_current_month ?? 0} objetos entregados
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Usuarios activos</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {stats?.active_users_percentage ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(stats?.active_users_percentage ?? 0, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    De {stats?.total_users ?? 0} usuarios registrados
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Denuncias resueltas
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {stats?.resolved_complaints_percentage_current_month ?? 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(stats?.resolved_complaints_percentage_current_month ?? 0, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stats?.active_complaints ?? 0} pendientes de revisión
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
}
