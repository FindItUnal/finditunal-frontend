import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTemplate } from '../components/templates';
import { SearchFilterBar, ItemGrid, EmptyState } from '../components/organisms';
import PublishModal from '../components/organisms/PublishModal';
import { useSearchFilter, useModal, useCategories, useLocations, useObjects, useReportMutations, useComplaintMutation } from '../hooks';
import ReportDialog from '../components/molecules/ReportDialog';
import { LoadingSpinner } from '../components/atoms';
import { useToast } from '../context/ToastContext';
import useUserStore from '../store/useUserStore';

export default function DashboardPage() {
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();
  const toast = useToast();
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useSearchFilter('Todas');
  const publishModal = useModal();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportItemId, setReportItemId] = useState<string | null>(null);

  // Usar hooks de TanStack Query
  const { data: backendCategories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: backendLocations = [] } = useLocations();
  const { data: items = [], isLoading: isLoadingObjects, error: objectsError } = useObjects();
  const { handlePublish, isPending: isPublishing } = useReportMutations();
  const { submitComplaint } = useComplaintMutation();

  // Preparar categorías para el filtro (agregar "Todas" al inicio)
  const categories = useMemo(() => {
    return ['Todas', ...backendCategories.map((cat) => cat.name)];
  }, [backendCategories]);

  // Filtrar items - usar useMemo para recalcular cuando cambien items, searchTerm o selectedCategory
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    // Aplicar filtro directamente aquí para asegurar que se recalcule correctamente
    return items.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todas' ||
        item.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  const handlePublishSubmit = async (data: {
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
    try {
      await handlePublish(data, backendCategories, backendLocations);
      publishModal.close();
      toast.success('Objeto publicado exitosamente');
    } catch (err) {
      console.error('Error al publicar objeto:', err);
      toast.error(err instanceof Error ? err.message : 'Error al publicar el objeto');
    }
  };

  const isLoading = isLoadingCategories || isLoadingObjects;

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
          <LoadingSpinner message="Cargando objetos..." />
        ) : objectsError ? (
          <EmptyState
            title="Error al cargar objetos"
            description={objectsError instanceof Error ? objectsError.message : 'Error desconocido'}
          />
        ) : filteredItems.length > 0 ? (
          <ItemGrid
            items={filteredItems}
            onItemOpen={(id) => navigate(`/object/${id}`)}
            onItemMessage={() => navigate('/messages')}
            onItemReport={(id) => {
              setReportItemId(id);
              setReportOpen(true);
            }}
            onItemDelete={(id) => {
              // TODO: Implementar eliminación desde backend
              console.warn(`Eliminar publicación ${id} - funcionalidad pendiente`);
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
          }
        }}
        onPublish={handlePublishSubmit}
        categories={backendCategories}
        locations={backendLocations}
        isLoading={isPublishing}
      />

      <ReportDialog
        open={reportOpen}
        onOpenChange={(open) => {
          setReportOpen(open);
          if (!open) setReportItemId(null);
        }}
        onReport={async (payload) => {
          if (!reportItemId) return;
          
          try {
            const reportId = parseInt(reportItemId, 10);
            if (isNaN(reportId)) {
              toast.error('ID de publicación inválido');
              return;
            }
            
            await submitComplaint.mutateAsync({
              reportId,
              payload,
            });
            
            toast.success('Denuncia enviada correctamente');
            setReportOpen(false);
            setReportItemId(null);
          } catch (err) {
            console.error('Error al enviar denuncia:', err);
            toast.error(
              err instanceof Error 
                ? err.message 
                : 'Error al enviar la denuncia. Por favor, intenta nuevamente.'
            );
          }
        }}
      />
    </PageTemplate>
  );
}
