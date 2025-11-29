import { MapPin, Calendar, User, MessageCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTemplate } from '../components/templates';
import ReportDialog from '../components/molecules/ReportDialog';
import BackButton from '../components/atoms/BackButton';
import { Button, Badge } from '../components/atoms';
import useUserStore from '../store/useUserStore';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import { useObjectById } from '../hooks';
import { formatDate } from '../utils/dateUtils';
import { EmptyState } from '../components/organisms';

export default function ObjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reportOpen, setReportOpen] = useState(false);
  const user = useUserStore((s) => s.user);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Usar hook de TanStack Query para cargar el objeto
  const { data: object, isLoading, error } = useObjectById(id);

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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando objeto...</p>
          </div>
        </div>
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
                  <button
                    onClick={() => setConfirmOpen(true)}
                    className="border rounded-lg px-4 py-3 text-sm border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 transition transform duration-150 ease-in-out hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" /> Eliminar
                  </button>
                  <ConfirmDialog
                    open={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    title="Eliminar publicación"
                    description="¿Deseas eliminar esta publicación? Esta acción no se puede deshacer."
                    confirmLabel="Eliminar"
                    cancelLabel="Cancelar"
                    onConfirm={() => {
                      alert(`Eliminar objeto ${object.id}`);
                      setConfirmOpen(false);
                      navigate('/dashboard');
                    }}
                  />
                </>
              ) : (
                <button
                  onClick={() => setReportOpen(true)}
                  className="border rounded-lg px-4 py-3 text-sm border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 transition transform duration-150 ease-in-out hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Denunciar
                </button>
              )}
          </div>
        </div>
      </div>

      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onReport={(payload) => alert(`Reporte enviado: ${JSON.stringify(payload)}`)}
      />
    </PageTemplate>
  );
}
