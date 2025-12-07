import { MapPin, Calendar, User, MessageCircle, Trash2, Flag, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTemplate } from '../components/templates';
import ReportDialog from '../components/molecules/ReportDialog';
import { Button, Badge, BackButton, LoadingSpinner } from '../components/atoms';
import { useToast } from '../context/ToastContext';
import useUserStore from '../store/useUserStore';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import { useObjectById } from '../hooks';
import PublishModal from '../components/organisms/PublishModal';
import { useCategories, useLocations, useReportMutations } from '../hooks';
import { formatDate } from '../utils/dateUtils';
import { EmptyState } from '../components/organisms';

export default function ObjectDetailPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const [reportOpen, setReportOpen] = useState(false);
  const user = useUserStore((s) => s.user);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const { data: categories = [] } = useCategories();
  const { data: locations = [] } = useLocations();
  const { handlePublish, deleteReport, isPending: isPublishing } = useReportMutations();

  // Usar hook de TanStack Query para cargar el objeto
  const { data: object, isLoading, error } = useObjectById(id);

  console.log('Cargando objeto con ID:', id, object);

  const statusConfig = {
    found: {
      label: 'Encontrado',
      variant: 'success' as const,
    },
    claimed: {
      label: 'Entregado',
      variant: 'default' as const,
    },
    lost: {
      label: 'Perdido',
      variant: 'danger' as const,
    },
  };

  // Formatear fecha para mostrar
  const formattedDate = object?.date ? formatDate(object.date) : '';

  if (isLoading) {
    return (
      <PageTemplate>
        <BackButton to="/dashboard">Volver a explorar</BackButton>
        <LoadingSpinner message="Cargando objeto..." />
      </PageTemplate>
    );
  }

  if (error || !object) {
    return (
      <PageTemplate>
        <BackButton to="/dashboard">Volver a explorar</BackButton>
        <EmptyState
          title={error instanceof Error ? error.message : 'Objeto no encontrado'}
          description={error ? 'Intenta recargar la página' : 'El objeto que buscas no existe o ha sido eliminado'}
        />
      </PageTemplate>
    );
  }

  const isOwner = !!(user && object && user.id === object.userId);

  const handlePublishSubmit = async (payload: {
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
      await handlePublish(payload, categories, locations);
      setPublishOpen(false);
      toast.success(payload.reportId ? 'Publicación actualizada exitosamente' : 'Publicación creada exitosamente');
    } catch (err) {
      console.error('Error al guardar publicación desde detalle:', err);
      toast.error(err instanceof Error ? err.message : 'Error al guardar la publicación');
    }
  };

  const handleOwnerDelete = async () => {
    if (!object) return;
    try {
      const reportId = parseInt(object.id, 10);
      await deleteReport.mutateAsync(reportId);
      setConfirmOpen(false);
      toast.success('Publicación eliminada exitosamente');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al eliminar desde detalle:', err);
      toast.error(err instanceof Error ? err.message : 'Error al eliminar la publicación');
    }
  };

  return (
    <PageTemplate>
      <BackButton to="/dashboard">Volver a explorar</BackButton>

      <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl">
            <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl">
              {object.imageUrl ? (
                <img
                  src={object.imageUrl}
                  alt={object.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400 dark:text-gray-500">Sin imagen</p>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Badge variant={statusConfig[object.status].variant}>
                  {statusConfig[object.status].label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {object.title}
            </h1>
            <Badge variant="default">{object.category}</Badge>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Ubicación</p>
                  <p className="text-gray-600 dark:text-gray-400">{object.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">Fecha</p>
                  <p className="text-gray-600 dark:text-gray-400">{formattedDate}</p>
                </div>
              </div>

              {object.userName && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      Reportado por
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{object.userName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <div className="p-6">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">
                Descripción
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {object.description || 'Sin descripción disponible'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {isOwner ? (
              <>
                <Button
                  variant="primary"
                  icon={Edit2}
                  onClick={() => setPublishOpen(true)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  icon={Trash2}
                  onClick={() => setConfirmOpen(true)}
                >
                  Eliminar
                </Button>
                <ConfirmDialog
                  open={confirmOpen}
                  onOpenChange={setConfirmOpen}
                  title="Eliminar publicación"
                  description="¿Deseas eliminar esta publicación? Esta acción no se puede deshacer."
                  confirmLabel="Eliminar"
                  cancelLabel="Cancelar"
                  onConfirm={handleOwnerDelete}
                />
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  icon={MessageCircle}
                  onClick={() => navigate('/messages')}
                  className="flex-1"
                >
                  Contactar
                </Button>
                {user?.role === 'admin' ? (
                  <>
                    <Button
                      variant="outline"
                      icon={Trash2}
                      onClick={() => setConfirmOpen(true)}
                    >
                      Eliminar
                    </Button>
                    <ConfirmDialog
                      open={confirmOpen}
                      onOpenChange={setConfirmOpen}
                      title="Eliminar publicación"
                      description="¿Deseas eliminar esta publicación? Esta acción no se puede deshacer."
                      confirmLabel="Eliminar"
                      cancelLabel="Cancelar"
                      onConfirm={handleOwnerDelete}
                    />
                  </>
                ) : (
                  <Button
                    variant="outline"
                    icon={Flag}
                    onClick={() => setReportOpen(true)}
                  >
                    Denunciar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <PublishModal
        open={publishOpen}
        onOpenChange={(open) => setPublishOpen(open)}
        categories={categories}
        locations={locations}
        initialData={object ? {
          id: object.id,
          title: object.title,
          description: object.description,
          category: object.category,
          location: object.location,
          type: object.status === 'found' ? 'found' : 'lost',
          found_date: object.date,
          imageUrl: object.imageUrl,
          contact_method: object.contact_method || '',
        } : undefined}
        onPublish={handlePublishSubmit}
        submitLabel="Guardar cambios"
        isLoading={isPublishing}
      />

      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onReport={() => {
          // TODO: Implementar envío de reporte al backend
          toast.success('Reporte enviado correctamente');
          setReportOpen(false);
        }}
      />
    </PageTemplate>
  );
}
