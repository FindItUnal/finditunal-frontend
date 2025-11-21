import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { PageTemplate } from '../components/templates';
import PublishModal from '../components/organisms/PublishModal';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import PublicationsList from '../components/organisms/PublicationsList';
// user data accessed inside ProfileInfo via the store
import { Item } from '../types';
import ProfileInfo from '../components/ProfileInfo';
import ProfileEditor from '../components/ProfileEditor';
import { useProfile } from '../hooks/useProfile';

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
  // user is accessed inside ProfileInfo via the store
  const navigate = useNavigate();
  const [userItems, setUserItems] = useState<Item[]>(initialMockUserItems);
  const [publishOpen, setPublishOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const { isEditing } = useProfile();

  return (
    <PageTemplate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <ProfileInfo />
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

            <div className="mt-4">
              <ProfileEditor />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Editar Información</h3>
              <ProfileEditor />
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
