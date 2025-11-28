import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { PageTemplate } from '../components/templates';
import PublishModal from '../components/organisms/PublishModal';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import PublicationsList from '../components/organisms/PublicationsList';
import { Item } from '../types';
import ProfileInfo from '../components/ProfileInfo';
import ProfileEditor from '../components/ProfileEditor';
import { useProfile } from '../hooks/useProfile';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import {
  reportService,
  categoryService,
  locationService,
  Category,
  Location,
} from '../services';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [publishOpen, setPublishOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isEditing } = useProfile();
  const refreshUser = useUserStore((s) => s.refreshUser);
  const hasLoadedProfile = useRef(false);

  // Obtener user_id del usuario autenticado
  const getUserId = (): string | number => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    return user.user_id || user.id;
  };

  // Cargar perfil del usuario desde el backend al montar
  useEffect(() => {
    if (hasLoadedProfile.current) return;
    if (!user) return;
    
    hasLoadedProfile.current = true;
    
    const loadProfile = async () => {
      try {
        await refreshUser(apiUrl);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
      }
    };

    loadProfile();
  }, [apiUrl, refreshUser, user]);

  // Cargar categorías y ubicaciones
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const userId = user.user_id || user.id;
        const [categoriesData, locationsData] = await Promise.all([
          categoryService.getAllCategories(apiUrl, userId),
          locationService.getAllLocations(apiUrl, userId),
        ]);
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (err) {
        console.error('Error al cargar categorías/ubicaciones:', err);
      }
    };

    loadData();
  }, [user, apiUrl]);

  // Cargar reportes del usuario
  useEffect(() => {
    const loadUserReports = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Esperar a que se carguen las categorías y ubicaciones
      if (categories.length === 0 || locations.length === 0) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const userId = user.user_id || user.id;
        const reports = await reportService.getUserReports(apiUrl, userId);
        
        // Mapear reportes a Items usando categorías y ubicaciones
        const mappedItems = reports.map((report) =>
          reportService.mapUserReportToItem(report, categories, locations)
        );
        setUserItems(mappedItems);
      } catch (err) {
        console.error('Error al cargar reportes:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las publicaciones');
        setUserItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserReports();
  }, [user, apiUrl, categories, locations]);

  // Función para recargar reportes
  const reloadReports = async () => {
    if (!user || categories.length === 0 || locations.length === 0) return;

    try {
      const userId = getUserId();
      const reports = await reportService.getUserReports(apiUrl, userId);
      const mappedItems = reports.map((report) =>
        reportService.mapUserReportToItem(report, categories, locations)
      );
      setUserItems(mappedItems);
    } catch (err) {
      console.error('Error al recargar reportes:', err);
    }
  };

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
                  <span className="text-gray-600 dark:text-gray-400">Objetos encontrados</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {userItems.filter((item) => item.status === 'found').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Miembro desde</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {user?.createdAt
                      ? (() => {
                          const date = new Date(user.createdAt);
                          const month = date.toLocaleDateString('es-ES', { month: 'short' });
                          const year = date.getFullYear();
                          return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
                        })()
                      : '—'}
                  </span>
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
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Cargando publicaciones...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 dark:text-red-400 mb-2">Error al cargar publicaciones</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
                    </div>
                  ) : (
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
                        // Esta funcionalidad no está en el backend, se puede mantener como local
                        setUserItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'claimed' } : it)));
                      }}
                    />
                  )}
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
        categories={categories}
        locations={locations}
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
                contact_method: editingItem.contact_method || '',
              }
            : undefined
        }
        submitLabel={editingItem ? 'Guardar cambios' : 'Publicar'}
        onPublish={async (payload) => {
          if (!user) return;

          try {
            const userId = getUserId();

            // Convertir nombres a IDs
            const categoryId = reportService.findCategoryId(payload.category, categories);
            const locationId = reportService.findLocationId(payload.location, locations);

            if (!categoryId || !locationId) {
              throw new Error('Categoría o ubicación inválida');
            }

            // Convertir tipo del frontend al formato del backend
            const status: 'perdido' | 'encontrado' = payload.type === 'lost' ? 'perdido' : 'encontrado';

            if (payload.reportId) {
              // Modo edición
              const reportId = parseInt(payload.reportId, 10);
              await reportService.updateReport(apiUrl, userId, reportId, {
                category_id: categoryId,
                location_id: locationId,
                title: payload.title,
                description: payload.description,
                status: status,
                date_lost_or_found: payload.found_date,
                contact_method: payload.contact_method,
                image: payload.image,
              });
            } else {
              // Modo creación (no debería pasar desde ProfilePage, pero por si acaso)
              await reportService.createReport(apiUrl, userId, {
                category_id: categoryId,
                location_id: locationId,
                title: payload.title,
                description: payload.description,
                status: status,
                date_lost_or_found: payload.found_date,
                contact_method: payload.contact_method,
                image: payload.image,
              });
            }

            // Recargar reportes después de editar
            await reloadReports();
            setPublishOpen(false);
            setEditingItem(null);
          } catch (err) {
            console.error('Error al guardar publicación:', err);
            alert(err instanceof Error ? err.message : 'Error al guardar la publicación');
          }
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
        onConfirm={async () => {
          if (!toDeleteId || !user) return;

          try {
            const userId = getUserId();
            const reportId = parseInt(toDeleteId, 10);
            await reportService.deleteReport(apiUrl, userId, reportId);
            
            // Recargar reportes después de eliminar
            await reloadReports();
            setToDeleteId(null);
            setConfirmOpen(false);
          } catch (err) {
            console.error('Error al eliminar publicación:', err);
            alert(err instanceof Error ? err.message : 'Error al eliminar la publicación');
          }
        }}
      />
    </PageTemplate>
  );
}
