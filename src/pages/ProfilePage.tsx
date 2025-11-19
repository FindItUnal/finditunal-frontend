import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { PageTemplate } from '../components/templates';
import PublishModal from '../components/organisms/PublishModal';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import PublicationsList from '../components/organisms/PublicationsList';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { Item } from '../types';

const initialMockUserItems: Item[] = [
  {
    id: '1',
    title: 'Audífonos Sony',
    description: 'Encontrados en el laboratorio de cómputo',
    category: 'Electrónicos',
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Laboratorio 3',
    date: '2025-10-15',
    status: 'found',
    userId: '1',
    userName: 'Usuario Demo',
    createdAt: '2025-10-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Cuaderno de Matemáticas',
    description: 'Cuaderno con apuntes de cálculo',
    category: 'Libros',
    imageUrl: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Aula 201',
    date: '2025-10-12',
    status: 'claimed',
    userId: '1',
    userName: 'Usuario Demo',
    createdAt: '2025-10-12T14:30:00Z',
  },
];

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const updateUserStore = useUserStore((s) => s.updateUser);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [userItems, setUserItems] = useState<Item[]>(initialMockUserItems);
  const [publishOpen, setPublishOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone_number || '');
  }, [user]);

  return (
    <PageTemplate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
                <span className="inline-block px-4 py-2 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full text-sm font-semibold">
                  {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Estadísticas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Objetos publicados</span>
                    <span className="font-bold text-gray-900 dark:text-white">{userItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Objetos Entregado</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {userItems.filter((item) => item.status === 'claimed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Miembro desde</span>
                    <span className="font-bold text-gray-900 dark:text-white">Oct 2025</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full mt-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {isEditing ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Editar Información</h3>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Correo institucional
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      El correo institucional no se puede cambiar
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="Dejar en blanco para no cambiar"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!user) return;
                        setSaving(true);
                        setError(null);
                        try {
                          const uid = user.user_id ?? (user.id as string);
                          const resp = await fetch(
                            `${apiUrl.replace(/\/$/, '')}/user/${encodeURIComponent(uid)}/profile/update`,
                            {
                              method: 'PATCH',
                              credentials: 'include',
                              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                              body: JSON.stringify({ phone_number: phone }),
                            },
                          );

                          if (!resp.ok) {
                            const body = await resp.json().catch(() => ({}));
                            setError(body?.message || `Error: ${resp.status}`);
                            setSaving(false);
                            return;
                          }

                          // Update store optimistically
                          updateUserStore({ phone_number: phone });
                          // Optionally fetch full profile: const updated = await resp.json(); setUser(updated);

                          setIsEditing(false);
                        } catch (err) {
                          setError('Error de red o servidor');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                  {error && <div className="text-red-600">{error}</div>}
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mis Publicaciones</h3>
                  <div>
                    <PublicationsList
                      items={userItems}
                      onEdit={(item) => {
                        setEditingItem(item);
                        setPublishOpen(true);
                      }}
                      onDelete={(id) => {
                        setToDeleteId(id);
                        setConfirmOpen(true);
                      }}
                      onGoDashboard={() => navigate('/dashboard')}
                      onMarkClaimed={(id) => {
                        setUserItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'claimed' } : it)));
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      <PublishModal
        open={publishOpen}
        onOpenChange={(open) => {
          setPublishOpen(open);
          if (!open) setEditingItem(null);
        }}
        initialData={
          editingItem
            ? {
                id: editingItem.id,
                title: editingItem.title,
                description: editingItem.description,
                category: editingItem.category,
                location: editingItem.location,
                type: editingItem.status === 'found' ? 'found' : 'lost',
                found_date: editingItem.date,
                imageUrl: editingItem.imageUrl,
              }
            : undefined
        }
        submitLabel={editingItem ? 'Editar' : 'Publicar'}
        onPublish={(payload) => {
          if (!editingItem) return;
          setUserItems((prev) =>
            prev.map((it) =>
              it.id === editingItem.id
                ? {
                    ...it,
                    title: payload.title ?? it.title,
                    description: payload.description ?? it.description,
                    category: payload.category ?? it.category,
                    location: payload.location ?? it.location,
                    date: payload.found_date ?? it.date,
                    imageUrl: payload.image_preview ?? it.imageUrl,
                  }
                : it
            )
          );
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setToDeleteId(null);
        }}
        title="Eliminar publicación"
        description="¿Deseas eliminar esta publicación? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={() => {
          if (!toDeleteId) return;
          setUserItems((prev) => prev.filter((it) => it.id !== toDeleteId));
          setToDeleteId(null);
          setConfirmOpen(false);
        }}
      />
    </PageTemplate>
  );
}
