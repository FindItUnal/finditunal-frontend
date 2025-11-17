import { useState } from 'react';
import { Search, UserX, Ban, MoreVertical, Mail, Calendar } from 'lucide-react';
import { PageTemplate } from '../components/templates';
import BackButton from '../components/atoms/BackButton';
import { Card, Badge } from '../components/atoms';
import { User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@universidad.edu',
    role: 'user',
    status: 'active',
    createdAt: '2025-09-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria.garcia@universidad.edu',
    role: 'user',
    status: 'active',
    createdAt: '2025-09-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@universidad.edu',
    role: 'user',
    status: 'active',
    createdAt: '2025-10-01T09:15:00Z',
  },
  {
    id: '4',
    name: 'Ana López',
    email: 'ana.lopez@universidad.edu',
    role: 'user',
    status: 'suspended',
    createdAt: '2025-08-10T16:45:00Z',
  },
  {
    id: '5',
    name: 'Pedro Martínez',
    email: 'pedro.martinez@universidad.edu',
    role: 'user',
    status: 'active',
    createdAt: '2025-10-05T11:20:00Z',
  },
  {
    id: '6',
    name: 'Laura Fernández',
    email: 'laura.fernandez@universidad.edu',
    role: 'user',
    status: 'active',
    createdAt: '2025-09-25T13:00:00Z',
  },
];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <p className="text-gray-600 dark:text-gray-400">
                Total de usuarios: {mockUsers.length} | Activos:{' '}
                {mockUsers.filter((u) => u.status === 'active').length}
              </p>
            </div>
            <div className="relative flex-1 lg:max-w-md">
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
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
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={user.status === 'active' ? 'success' : 'danger'}
                    >
                      {user.status === 'active' ? 'Activo' : 'Suspendido'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionMenu(
                            showActionMenu === user.id ? null : user.id
                          );
                        }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {showActionMenu === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-600">
                          <button className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2 transition-colors">
                            <Ban className="w-4 h-4" />
                            <span>
                              {user.status === 'active' ? 'Suspender' : 'Activar'}
                            </span>
                          </button>
                          <button className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 flex items-center space-x-2 transition-colors">
                            <UserX className="w-4 h-4" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
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
          onClick={() => setSelectedUser(null)}
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
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.status === 'active' ? 'Activo' : 'Suspendido'}
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
                    {new Date(selectedUser.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Estadísticas de Actividad
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      12
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Publicaciones
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">5</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recuperados
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      8
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ayudados</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
              <button className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105">
                {selectedUser.status === 'active' ? 'Suspender' : 'Activar'}
              </button>
              <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTemplate>
  );
}
