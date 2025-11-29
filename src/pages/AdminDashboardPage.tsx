import {
  Package,
  Users,
  AlertCircle,
  TrendingUp,
  User as UserIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '../components/templates';
import { Card, Button } from '../components/atoms';
import { Metrics } from '../types';
import useUserStore from '../store/useUserStore';

/**
 * DATOS MOCK - PENDIENTE INTEGRACIÓN CON BACKEND
 * 
 * TODO: Reemplazar con integración real cuando los endpoints de admin estén disponibles:
 * - Implementar adminService.getMetrics() para obtener estadísticas reales
 * - Implementar adminService.getRecentActivity() para actividad reciente
 * 
 * @deprecated Usar adminService cuando esté disponible
 */
const mockMetrics: Metrics = {
  totalUsers: 245,
  totalItems: 87,
  activeReports: 12,
  itemsFound: 34,
};

interface ActivityItem {
  id: string;
  type: 'user' | 'item' | 'report';
  message: string;
  time: string;
}

/**
 * @deprecated Usar adminService.getRecentActivity() cuando esté disponible
 */
const recentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'user',
    message: 'Nuevo usuario registrado: juan.perez@universidad.edu',
    time: 'Hace 5 min',
  },
  {
    id: '2',
    type: 'item',
    message: 'Nuevo objeto publicado: iPhone 13 Pro',
    time: 'Hace 15 min',
  },
  {
    id: '3',
    type: 'report',
    message: 'Nueva denuncia recibida: Contenido inapropiado',
    time: 'Hace 30 min',
  },
  {
    id: '4',
    type: 'item',
    message: 'Objeto Entregado: Mochila negra Nike',
    time: 'Hace 1 hora',
  },
  {
    id: '5',
    type: 'user',
    message: 'Usuario suspendido: spam.user@universidad.edu',
    time: 'Hace 2 horas',
  },
];

export default function AdminDashboardPage() {
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();

  return (
    <PageTemplate>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona usuarios, publicaciones y reportes del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-teal-600 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {mockMetrics.totalUsers}
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 font-medium">Total Usuarios</h3>
          <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">+12 esta semana</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-cyan-600 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {mockMetrics.totalItems}
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 font-medium">
            Objetos Publicados
          </h3>
          <p className="text-sm text-cyan-600 dark:text-cyan-400 mt-2">+8 hoy</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-amber-600 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {mockMetrics.activeReports}
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
              {mockMetrics.itemsFound}
            </span>
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 font-medium">
            Objetos Recuperados
          </h3>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">Este mes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Actividad Reciente
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'user'
                        ? 'bg-teal-100 dark:bg-teal-900'
                        : activity.type === 'item'
                        ? 'bg-cyan-100 dark:bg-cyan-900'
                        : 'bg-amber-100 dark:bg-amber-900'
                    }`}
                  >
                    {activity.type === 'user' ? (
                      <UserIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    ) : activity.type === 'item' ? (
                      <Package className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {activity.message}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Estadísticas del Mes
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tasa de recuperación
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">39%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '39%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Usuarios activos</span>
                  <span className="font-bold text-gray-900 dark:text-white">68%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: '68%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Denuncias resueltas
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-600 h-2 rounded-full"
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
}
