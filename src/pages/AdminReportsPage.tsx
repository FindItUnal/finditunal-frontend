import { useState, useCallback, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Calendar, 
  RefreshCw, 
  Loader2,
  Eye,
  Trash2,
  FileText,
  MapPin,
  Package,
  User
} from 'lucide-react';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import { PageTemplate } from '../components/templates';
import BackButton from '../components/atoms/BackButton';
import { Card, Badge } from '../components/atoms';
import { ComplaintRecord, ComplaintStatus, ComplaintReason, Item } from '../types';
import { useAdminComplaints } from '../hooks';
import { objectService, mapBackendObjectToItem } from '../services';
import useGlobalStore from '../store/useGlobalStore';
import useUserStore from '../store/useUserStore';
import { getUserId } from '../utils/userUtils';

// Mapeo de razones a texto legible
const reasonLabels: Record<ComplaintReason, string> = {
  spam: 'Spam',
  inappropriate: 'Contenido inapropiado',
  fraud: 'Fraude',
  other: 'Otro',
};

// Mapeo de estados a texto legible
const statusLabels: Record<ComplaintStatus, string> = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  resolved: 'Resuelto',
  rejected: 'Rechazado',
};

// Skeleton para las filas
function ComplaintRowSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
            <div className="h-4 w-full max-w-md bg-gray-300 dark:bg-gray-600 rounded mb-3" />
            <div className="flex flex-wrap gap-4">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const {
    complaints,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    markInReview,
    discard,
    resolve,
    actionLoading,
    pendingCount,
    totalCount,
  } = useAdminComplaints();

  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const user = useUserStore((s) => s.user);

  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);
  const [reportedItem, setReportedItem] = useState<Item | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'discard' | 'resolve' | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<ComplaintRecord | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Filtrar por estado si hay filtro activo
  const filteredComplaints = filters.status 
    ? complaints.filter(c => c.status === filters.status)
    : complaints;

  const handleStatusFilterChange = (status: string) => {
    if (status === 'all') {
      setFilters({});
    } else {
      setFilters({ status: status as ComplaintStatus });
    }
  };

  const handleSelect = useCallback(async (complaint: ComplaintRecord) => {
    if (selectedComplaint?.complaint_id === complaint.complaint_id) {
      setSelectedComplaint(null);
      setReportedItem(null);
    } else {
      setSelectedComplaint(complaint);
      setReportedItem(null);
      setLoadingReport(true);
      
      // Cargar información del reporte denunciado
      try {
        if (user) {
          const userId = getUserId(user);
          const backendObject = await objectService.getObjectById(apiUrl, userId, complaint.report_id);
          const item = mapBackendObjectToItem(backendObject, apiUrl, userId);
          setReportedItem(item);
        }
      } catch (err) {
        console.error('Error al cargar el reporte denunciado:', err);
        setReportedItem(null);
      } finally {
        setLoadingReport(false);
      }
    }
  }, [selectedComplaint, apiUrl, user]);

  const handleMarkInReview = async (complaint: ComplaintRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await markInReview(complaint.complaint_id);
    if (success && selectedComplaint?.complaint_id === complaint.complaint_id) {
      setSelectedComplaint({ ...complaint, status: 'in_review' });
    }
  };

  const openConfirmDialog = (action: 'discard' | 'resolve', complaint: ComplaintRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setConfirmAction(action);
    setConfirmTarget(complaint);
    setAdminNotes('');
  };

  const handleConfirmAction = async () => {
    if (!confirmTarget || !confirmAction) return;
    
    const notes = adminNotes.trim() || 'Sin notas adicionales';
    let success = false;

    if (confirmAction === 'discard') {
      success = await discard(confirmTarget.complaint_id, notes);
    } else if (confirmAction === 'resolve') {
      success = await resolve(confirmTarget.complaint_id, notes);
    }

    if (success) {
      // Actualizar selected si es la misma
      if (selectedComplaint?.complaint_id === confirmTarget.complaint_id) {
        setSelectedComplaint(null);
        setReportedItem(null);
      }
    }

    setConfirmAction(null);
    setConfirmTarget(null);
    setAdminNotes('');
  };

  const getStatusBadgeVariant = (status: ComplaintStatus): 'warning' | 'info' | 'success' | 'default' => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_review': return 'info';
      case 'resolved': return 'success';
      case 'rejected': return 'default';
      default: return 'default';
    }
  };

  const getStatusIconColor = (status: ComplaintStatus): string => {
    switch (status) {
      case 'pending': return 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400';
      case 'in_review': return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
      case 'rejected': return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <PageTemplate>
      <BackButton to="/admin">Volver al Panel</BackButton>

      <Card padding="none">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestión de Denuncias
              </h1>
              {loading ? (
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Total de denuncias: {totalCount} | Pendientes: {pendingCount}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                disabled={loading}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                title="Recargar denuncias"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <select 
                  value={filters.status || 'all'} 
                  onChange={(e) => handleStatusFilterChange(e.target.value)} 
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="all">Todas las denuncias</option>
                  <option value="pending">Pendientes</option>
                  <option value="in_review">En revisión</option>
                  <option value="resolved">Resueltas</option>
                  <option value="rejected">Rechazadas</option>
                </select>
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

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <>
              <ComplaintRowSkeleton />
              <ComplaintRowSkeleton />
              <ComplaintRowSkeleton />
              <ComplaintRowSkeleton />
            </>
          ) : (
            filteredComplaints.map((complaint) => (
              <div key={complaint.complaint_id}>
                <div 
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" 
                  onClick={() => handleSelect(complaint)}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusIconColor(complaint.status)}`}>
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                            {reasonLabels[complaint.reason]}
                          </h3>
                          <Badge variant={getStatusBadgeVariant(complaint.status)}>
                            {statusLabels[complaint.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {complaint.description || 'Sin descripción adicional'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Reporte #:</span> {complaint.report_id}
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(complaint.created_at).toLocaleString('es-ES')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Acciones rápidas para pendientes y en revisión */}
                    {(complaint.status === 'pending' || complaint.status === 'in_review') && (
                      <div className="flex flex-row md:flex-col items-center md:items-start space-x-2 md:space-x-0 md:space-y-2 mt-3 md:mt-0 md:ml-4">
                        {complaint.status === 'pending' && (
                          <button
                            onClick={(e) => handleMarkInReview(complaint, e)}
                            disabled={actionLoading === complaint.complaint_id}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors disabled:opacity-50"
                            title="Marcar en revisión"
                          >
                            {actionLoading === complaint.complaint_id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        )}
                        <button 
                          onClick={(e) => openConfirmDialog('discard', complaint, e)}
                          disabled={actionLoading === complaint.complaint_id}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50" 
                          title="Descartar denuncia"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => openConfirmDialog('resolve', complaint, e)}
                          disabled={actionLoading === complaint.complaint_id}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors disabled:opacity-50" 
                          title="Resolver y eliminar reporte"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Panel expandido con detalles */}
                {selectedComplaint?.complaint_id === complaint.complaint_id && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-4xl w-full border border-gray-200 dark:border-gray-700">
                      
                      {loadingReport ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                          <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando publicación...</span>
                        </div>
                      ) : reportedItem ? (
                        <div className="flex flex-col md:flex-row">
                          {/* Imagen - Lado izquierdo */}
                          <div className="w-full md:w-2/5 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                            {reportedItem.imageUrl ? (
                              <div className="w-full aspect-square md:aspect-[4/5] overflow-hidden">
                                <img 
                                  src={reportedItem.imageUrl} 
                                  alt={reportedItem.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full aspect-square md:aspect-[4/5] flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                  <Package className="w-12 h-12 mx-auto mb-2" />
                                  <p className="text-sm">Sin imagen</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Información - Lado derecho */}
                          <div className="w-full md:w-3/5 p-5 flex flex-col">
                            {/* Título y Estado */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{reportedItem.title}</h2>
                              <Badge variant={getStatusBadgeVariant(complaint.status)}>
                                {statusLabels[complaint.status]}
                              </Badge>
                            </div>
                            
                            {/* Publicación relacionada */}
                            <div className="mb-3">
                              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                                Publicación relacionada
                              </span>
                              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">ID: {complaint.report_id}</p>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-xs mb-4">
                              Aquí puedes ver la información completa de la publicación relacionada con este reporte.
                            </p>
                            
                            {/* Detalles */}
                            <div className="grid grid-cols-2 gap-3 flex-1 text-sm">
                              <div>
                                <p className="text-gray-500 dark:text-gray-500 text-xs">Ubicación</p>
                                <p className="text-gray-900 dark:text-white text-sm">{reportedItem.location}</p>
                              </div>
                              
                              <div>
                                <p className="text-gray-500 dark:text-gray-500 text-xs">Fecha</p>
                                <p className="text-gray-900 dark:text-white text-sm">
                                  {new Date(reportedItem.date).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-gray-500 dark:text-gray-500 text-xs">Reportado por</p>
                                <p className="text-gray-900 dark:text-white text-sm">{reportedItem.userName || 'Usuario'}</p>
                              </div>
                              
                              <div className="col-span-2">
                                <p className="text-gray-500 dark:text-gray-500 text-xs">Descripción del reporte</p>
                                <p className="text-gray-900 dark:text-white text-sm line-clamp-2">{complaint.description || 'Sin descripción adicional'}</p>
                              </div>
                            </div>
                            
                            {/* Botones - Solo mostrar si la denuncia no está resuelta */}
                            {(complaint.status === 'pending' || complaint.status === 'in_review') && (
                              <div className="flex flex-wrap justify-end gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                {complaint.status === 'pending' && (
                                  <button 
                                    onClick={(e) => handleMarkInReview(complaint, e)}
                                    disabled={actionLoading === complaint.complaint_id}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {actionLoading === complaint.complaint_id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Eye className="w-3 h-3" />
                                    )}
                                    En revisión
                                  </button>
                                )}
                                <button 
                                  onClick={() => openConfirmDialog('discard', complaint)}
                                  disabled={actionLoading === complaint.complaint_id}
                                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium disabled:opacity-50"
                                >
                                  Descartar
                                </button>
                                <button 
                                  onClick={() => openConfirmDialog('resolve', complaint)}
                                  disabled={actionLoading === complaint.complaint_id}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium disabled:opacity-50"
                                >
                                  Eliminar reporte
                                </button>
                                <button 
                                  onClick={() => { setSelectedComplaint(null); setReportedItem(null); }} 
                                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-600"
                                >
                                  Cerrar
                                </button>
                              </div>
                            )}
                            
                            {/* Solo botón cerrar si la denuncia ya está resuelta */}
                            {(complaint.status === 'resolved' || complaint.status === 'rejected') && (
                              <div className="flex justify-end mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <button 
                                  onClick={() => { setSelectedComplaint(null); setReportedItem(null); }} 
                                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg text-xs font-medium border border-gray-300 dark:border-gray-600"
                                >
                                  Cerrar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                          <AlertCircle className="w-10 h-10 mx-auto mb-2" />
                          <p className="text-sm">No se pudo cargar la información de la publicación</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">Es posible que haya sido eliminada</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {!loading && filteredComplaints.length === 0 && (
          <div className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 dark:text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay Denuncias
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filters.status 
                ? `No se encontraron denuncias con estado "${statusLabels[filters.status]}"`
                : 'No hay denuncias registradas en el sistema'
              }
            </p>
          </div>
        )}
      </Card>

      {/* Confirm dialog para descartar */}
      <ConfirmDialog
        open={confirmAction === 'discard'}
        onOpenChange={(open) => {
          if (!open && confirmAction === 'discard') {
            // Solo limpiar si se cierra manualmente (cancelar o X)
            setConfirmAction(null);
            setConfirmTarget(null);
            setAdminNotes('');
          }
        }}
        title="Descartar denuncia"
        description={
          <div className="space-y-4">
            <p>La denuncia será marcada como resuelta sin eliminar el reporte denunciado.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas del administrador (opcional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Ej: No se encontraron problemas en el reporte"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        }
        confirmLabel="Descartar denuncia"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmAction}
      />

      {/* Confirm dialog para resolver y eliminar */}
      <ConfirmDialog
        open={confirmAction === 'resolve'}
        onOpenChange={(open) => {
          if (!open && confirmAction === 'resolve') {
            // Solo limpiar si se cierra manualmente (cancelar o X)
            setConfirmAction(null);
            setConfirmTarget(null);
            setAdminNotes('');
          }
        }}
        title="Resolver denuncia y eliminar reporte"
        description={
          <div className="space-y-4">
            <p className="text-red-600 dark:text-red-400 font-medium">
              ⚠️ Esta acción eliminará permanentemente el reporte #{confirmTarget?.report_id}
            </p>
            <p>La denuncia será marcada como resuelta y el reporte denunciado será eliminado del sistema.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas del administrador (opcional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Ej: Reporte eliminado por contenido inapropiado"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        }
        confirmLabel="Eliminar reporte"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmAction}
      />
    </PageTemplate>
  );
}
