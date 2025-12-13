import { useState, useCallback } from 'react';
import { Search, Ban, UserCheck, MoreVertical, Mail, Calendar, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { PageTemplate } from '../components/templates';
import BackButton from '../components/atoms/BackButton';
import { Card, Badge } from '../components/atoms';
import { AdminUserSummary, UserDetailWithStats } from '../types';
import { useAdminUsers } from '../hooks';
import { getAdminUserDetail } from '../services';
import useGlobalStore from '../store/useGlobalStore';

// Skeleton para las filas de la tabla
function UserRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="ml-4">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded ml-auto" />
      </td>
    </tr>
  );
}

export default function AdminUsersPage() {
  const { users, loading, error, refetch, banUser, unbanUser, banningUserId, unbanningUserId } = useAdminUsers();
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetailWithStats | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsersCount = users.filter((u) => u.is_active === 1).length;

  // Manejar selección de usuario y cargar detalle
  const handleUserSelect = useCallback(async (user: AdminUserSummary) => {
    setSelectedUser(user);
    setLoadingDetail(true);
    setUserDetail(null);
    
    try {
      const detail = await getAdminUserDetail(apiUrl, user.user_id);
      setUserDetail(detail);
    } catch (err) {
      console.error('Error al cargar detalle del usuario:', err);
    } finally {
      setLoadingDetail(false);
    }
  }, [apiUrl]);

  // Manejar baneo de usuario
  const handleBanUser = useCallback(async (userId: string) => {
    const success = await banUser(userId);
    if (success) {
      // Cerrar el modal si el usuario baneado es el seleccionado
      if (selectedUser?.user_id === userId) {
        setSelectedUser(null);
        setUserDetail(null);
      }
      setShowActionMenu(null);
    }
  }, [banUser, selectedUser]);

  // Manejar desbaneo de usuario
  const handleUnbanUser = useCallback(async (userId: string) => {
    const success = await unbanUser(userId);
    if (success) {
      // Actualizar el modal si el usuario desbaneado es el seleccionado
      if (selectedUser?.user_id === userId) {
        setSelectedUser({ ...selectedUser, is_active: 1 });
      }
      setShowActionMenu(null);
    }
  }, [unbanUser, selectedUser]);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setUserDetail(null);
  }, []);

  return (
    <PageTemplate>
      <BackButton to="/admin">Volver al Panel</BackButton>

      <Card padding="none">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestión de Usuarios
              </h1>
              {loading ? (
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Total de usuarios: {users.length} | Activos: {activeUsersCount}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                disabled={loading}
                className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                title="Recargar usuarios"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o correo..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <button
                onClick={() => refetch()}
                className="ml-auto text-sm underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Skeleton loading
                <>
                  <UserRowSkeleton />
                  <UserRowSkeleton />
                  <UserRowSkeleton />
                  <UserRowSkeleton />
                  <UserRowSkeleton />
                </>
              ) : (
                filteredUsers.map((user) => (
                <tr
                  key={user.user_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        {user.role === 'admin' && (
                          <Badge variant="info" className="mt-1 text-xs">Admin</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(user.created_at).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={user.is_active === 1 ? 'success' : 'danger'}
                    >
                      {user.is_active === 1 ? 'Activo' : 'Suspendido'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionMenu(
                            showActionMenu === user.user_id ? null : user.user_id
                          );
                        }}
                        disabled={banningUserId === user.user_id || unbanningUserId === user.user_id}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {banningUserId === user.user_id || unbanningUserId === user.user_id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <MoreVertical className="w-5 h-5" />
                        )}
                      </button>
                      {showActionMenu === user.user_id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-600">
                          {user.is_active === 1 ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBanUser(user.user_id);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center space-x-2 transition-colors rounded-lg"
                            >
                              <Ban className="w-4 h-4" />
                              <span>Banear Usuario</span>
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnbanUser(user.user_id);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center space-x-2 transition-colors rounded-lg"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Desbanear Usuario</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron usuarios con esos criterios
            </p>
          </div>
        )}
      </Card>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Detalles del Usuario
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                  {selectedUser.phone_number && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Tel: {selectedUser.phone_number}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.is_active === 1 ? 'Activo' : 'Suspendido'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rol</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Fecha de Registro
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedUser.created_at).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Estadísticas de Actividad
                </h4>
                {loadingDetail ? (
                  <div className="grid grid-cols-2 gap-4 text-center animate-pulse">
                    <div>
                      <div className="h-8 w-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-1" />
                      <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
                    </div>
                    <div>
                      <div className="h-8 w-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-1" />
                      <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
                    </div>
                  </div>
                ) : userDetail ? (
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        {userDetail.total_reports}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Publicaciones
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {userDetail.delivered_reports}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Entregados
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No se pudieron cargar las estadísticas
                  </p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
              {selectedUser.is_active === 1 ? (
                <button 
                  onClick={() => handleBanUser(selectedUser.user_id)}
                  disabled={banningUserId === selectedUser.user_id}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
                >
                  {banningUserId === selectedUser.user_id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Baneando...
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4" />
                      Banear Usuario
                    </>
                  )}
                </button>
              ) : (
                <button 
                  onClick={() => handleUnbanUser(selectedUser.user_id)}
                  disabled={unbanningUserId === selectedUser.user_id}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
                >
                  {unbanningUserId === selectedUser.user_id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Desbaneando...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Desbanear Usuario
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
}
