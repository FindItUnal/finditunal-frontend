import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '../components/templates';
import { SearchFilterBar, ItemGrid, EmptyState } from '../components/organisms';
import PublishModal from '../components/organisms/PublishModal';
import { useSearchFilter, useModal } from '../hooks';
import { Item } from '../types';
import ReportDialog from '../components/molecules/ReportDialog';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import {
  objectService,
  mapBackendObjectToItem,
  categoryService,
  locationService,
  reportService,
  Category,
  Location,
} from '../services';

// Categorías por defecto (se reemplazarán con las del backend)
const defaultCategories = ['Todas'];

export default function DashboardPage() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, filterItems } = useSearchFilter('Todas');
  const publishModal = useModal();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportItemId, setReportItemId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [backendCategories, setBackendCategories] = useState<Category[]>([]);
  const [backendLocations, setBackendLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Obtener user_id del usuario autenticado
  const getUserId = (): string | number => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    // Usar user_id si está disponible, sino usar id
    return user.user_id || user.id;
  };

  // Cargar categorías del backend
  useEffect(() => {
    const loadCategories = async () => {
      if (!user) return;

      try {
        const userId = user.user_id || user.id;
        const categoriesData = await categoryService.getAllCategories(apiUrl, userId);
        setBackendCategories(categoriesData);
        // Agregar "Todas" al inicio y luego las categorías del backend
        const categoryNames = ['Todas', ...categoriesData.map((cat) => cat.name)];
        setCategories(categoryNames);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        // Si falla, usar categorías por defecto
        setCategories(defaultCategories);
      }
    };

    loadCategories();
  }, [user, apiUrl]);

  // Cargar ubicaciones del backend
  useEffect(() => {
    const loadLocations = async () => {
      if (!user) return;

      try {
        const userId = user.user_id || user.id;
        const locationsData = await locationService.getAllLocations(apiUrl, userId);
        setBackendLocations(locationsData);
      } catch (err) {
        console.error('Error al cargar ubicaciones:', err);
      }
    };

    loadLocations();
  }, [user, apiUrl]);

  // Cargar objetos del backend
  useEffect(() => {
    const loadObjects = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const userId = getUserId();
        const backendObjects = await objectService.getAllObjects(apiUrl, userId);
        const mappedItems = backendObjects.map((obj) => mapBackendObjectToItem(obj, apiUrl, userId));
        setItems(mappedItems);
      } catch (err) {
        console.error('Error al cargar objetos:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los objetos');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadObjects();
  }, [user, apiUrl]);

  // Función para recargar objetos
  const reloadObjects = async () => {
    if (!user) return;

    try {
      const userId = getUserId();
      const backendObjects = await objectService.getAllObjects(apiUrl, userId);
      const mappedItems = backendObjects.map((obj) => mapBackendObjectToItem(obj, apiUrl, userId));
      setItems(mappedItems);
    } catch (err) {
      console.error('Error al recargar objetos:', err);
    }
  };

  const filteredItems = filterItems(items);

  const handlePublish = async (data: {
    title: string;
    description: string;
    category: string;
    location: string;
    type: 'found' | 'lost';
    found_date: string;
    contact_method: string;
    image?: File;
    reportId?: string;
  }) => {
    if (!user) return;

    try {
      setIsPublishing(true);
      setError(null);

      const userId = getUserId();

      // Convertir nombres a IDs
      const categoryId = reportService.findCategoryId(data.category, backendCategories);
      const locationId = reportService.findLocationId(data.location, backendLocations);

      if (!categoryId || !locationId) {
        throw new Error('Categoría o ubicación inválida');
      }

      // Convertir tipo del frontend al formato del backend
      const status: 'perdido' | 'encontrado' = data.type === 'lost' ? 'perdido' : 'encontrado';

      if (data.reportId) {
        // Modo edición
        const reportId = parseInt(data.reportId, 10);
        await reportService.updateReport(apiUrl, userId, reportId, {
          category_id: categoryId,
          location_id: locationId,
          title: data.title,
          description: data.description,
          status: status,
          date_lost_or_found: data.found_date,
          contact_method: data.contact_method,
          image: data.image,
        });
      } else {
        // Modo creación
        await reportService.createReport(apiUrl, userId, {
          category_id: categoryId,
          location_id: locationId,
          title: data.title,
          description: data.description,
          status: status,
          date_lost_or_found: data.found_date,
          contact_method: data.contact_method,
          image: data.image,
        });
      }

      // Recargar objetos después de crear/editar
      await reloadObjects();
      publishModal.close();
      setEditingItem(null);
    } catch (err) {
      console.error('Error al publicar objeto:', err);
      setError(err instanceof Error ? err.message : 'Error al publicar el objeto');
      alert(err instanceof Error ? err.message : 'Error al publicar el objeto');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = (item: Item) => {
    // Buscar la categoría y ubicación originales del objeto
    const backendObject = items.find((i) => i.id === item.id);
    if (backendObject) {
      setEditingItem(item);
      publishModal.open();
    }
  };

  return (
    <PageTemplate
      title={`Bienvenido, ${user?.name}`}
      subtitle="Encuentra objetos perdidos o publica algo que hayas encontrado"
    >
      <div className="space-y-8">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onPublish={publishModal.open}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando objetos...</p>
            </div>
          </div>
        ) : error ? (
          <EmptyState
            title="Error al cargar objetos"
            description={error}
          />
        ) : filteredItems.length > 0 ? (
          <ItemGrid
            items={filteredItems}
            onItemOpen={(id) => {
              navigate(`/object/${id}`);
              console.log(`Abrir objeto ${id}`);
            }}
            onItemMessage={() => navigate('/messages')}
            onItemReport={(id) => {
              setReportItemId(id);
              setReportOpen(true);
            }}
            onItemDelete={(id) => {
              // For now just alert; in a real app you'd call backend to delete and refresh list

              console.log(`Eliminar publicación ${id}`);
            }}
          />
        ) : (
          <EmptyState
            title="No se encontraron resultados"
            description="Intenta con otros términos de búsqueda o filtros"
          />
        )}
      </div>

      <PublishModal
        open={publishModal.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            publishModal.close();
            setEditingItem(null);
          }
        }}
        onPublish={handlePublish}
        categories={backendCategories}
        locations={backendLocations}
        initialData={
          editingItem
            ? {
                id: editingItem.id,
                title: editingItem.title,
                description: editingItem.description,
                category: editingItem.category,
                location: editingItem.location,
                type: editingItem.status === 'lost' ? 'lost' : 'found',
                found_date: editingItem.date,
                imageUrl: editingItem.imageUrl,
                contact_method: editingItem.contact_method || '',
              }
            : undefined
        }
        submitLabel={editingItem ? 'Guardar cambios' : 'Publicar'}
        isLoading={isPublishing}
      />

      <ReportDialog
        open={reportOpen}
        onOpenChange={(open) => {
          setReportOpen(open);
          if (!open) setReportItemId(null);
        }}
        onReport={(payload) => {
          alert(`Reporte enviado para item ${reportItemId}: ${JSON.stringify(payload)}`);
          setReportOpen(false);
          setReportItemId(null);
        }}
      />
    </PageTemplate>
  );
}
