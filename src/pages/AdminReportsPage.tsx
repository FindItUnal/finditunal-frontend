import { useEffect, useState } from 'react';
import { AlertCircle, Trash2, CheckCircle, XCircle, Filter, Calendar } from 'lucide-react';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import { PageTemplate } from '../components/templates';
import BackButton from '../components/atoms/BackButton';
import { Card, Badge } from '../components/atoms';
import { Report } from '../types';

const mockReports: Report[] = [
  { id: '1', itemId: '1', itemTitle: 'iPhone 13 Pro', reporterId: '3', reporterName: 'Carlos Ruiz', reason: 'Contenido inapropiado', description: 'La imagen contiene información personal visible', status: 'pending', createdAt: '2025-10-23T10:00:00Z' },
  { id: '2', itemId: '2', itemTitle: 'Mochila negra Nike', reporterId: '4', reporterName: 'Ana López', reason: 'Publicación fraudulenta', description: 'Sospecho que esta publicación es falsa, he visto la misma imagen en otro sitio', status: 'pending', createdAt: '2025-10-23T09:30:00Z' },
  { id: '3', itemId: '3', itemTitle: 'Laptop Dell', reporterId: '5', reporterName: 'Pedro Martínez', reason: 'Información incorrecta', description: 'La ubicación reportada no coincide con donde realmente se encontró', status: 'resolved', createdAt: '2025-10-22T14:20:00Z' },
  { id: '5', itemId: '5', itemTitle: 'Libro Cálculo II', reporterId: '7', reporterName: 'Roberto Díaz', reason: 'Duplicado', description: 'Este objeto ya fue publicado anteriormente', status: 'dismissed', createdAt: '2025-10-21T11:30:00Z' },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Report | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');

  const filteredReports = reports.filter((r) => (filterStatus === 'all' ? true : r.status === filterStatus));
  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin:selectedReportId');
      if (saved) {
        const found = reports.find((r) => r.id === saved);
        if (found) setSelectedReport(found);
      }
    } catch (e) {
      // ignore
    }
  }, []); // run once on mount

  function handleSelect(report: Report) {
    // toggle selection
    if (selectedReport?.id === report.id) {
      setSelectedReport(null);
      try { localStorage.removeItem('admin:selectedReportId'); } catch (e) {}
      return;
    }
    setSelectedReport(report);
    try { localStorage.setItem('admin:selectedReportId', report.id); } catch (e) {}
  }

  function clearSelection() {
    setSelectedReport(null);
    try { localStorage.removeItem('admin:selectedReportId'); } catch (e) {}
  }

  function markResolved(id: string) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r)));
    if (selectedReport?.id === id) setSelectedReport({ ...selectedReport, status: 'resolved' });
  }

  function dismissReport(id: string) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'dismissed' } : r)));
    if (selectedReport?.id === id) setSelectedReport({ ...selectedReport, status: 'dismissed' });
  }

  function deleteReport(id: string) {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (selectedReport?.id === id) clearSelection();
  }

  return (
    <PageTemplate>
      <BackButton to="/admin">Volver al Panel</BackButton>

      <Card padding="none">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Denuncias</h1>
              <p className="text-gray-600 dark:text-gray-400">Total de denuncias: {reports.length} | Pendientes: {pendingCount}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors">
                <option value="all">Todos las denuncias</option>
                <option value="pending">Pendientes</option>
                <option value="resolved">Resueltos</option>
                <option value="dismissed">Descartados</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReports.map((report) => (
            <div key={report.id}>
              <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => handleSelect(report)}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${report.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900' : report.status === 'resolved' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                      <AlertCircle className={`w-6 h-6 ${report.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : report.status === 'resolved' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{report.reason}</h3>
                        <Badge variant={report.status === 'pending' ? 'warning' : report.status === 'resolved' ? 'success' : 'default'}>{report.status === 'pending' ? 'Pendiente' : report.status === 'resolved' ? 'Resuelto' : 'Descartado'}</Badge>
                      </div>
                      <p className="text-sm md:text-sm text-gray-600 dark:text-gray-400 mb-3">{report.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="text-gray-500 dark:text-gray-400"><span className="font-medium">Objeto:</span> {report.itemTitle}</div>
                        <div className="text-gray-500 dark:text-gray-400"><span className="font-medium">Reportado por:</span> {report.reporterName}</div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400"><Calendar className="w-4 h-4 mr-1" />{new Date(report.createdAt).toLocaleString('es-ES')}</div>
                      </div>
                    </div>
                  </div>
                  {report.status === 'pending' && (
                    <div className="flex flex-row md:flex-col items-center md:items-start space-x-2 md:space-x-0 md:space-y-2 mt-3 md:mt-0 md:ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // open confirmation for this report without expanding the details
                          setConfirmTarget(report);
                          setConfirmOpen(true);
                        }}
                        className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-md transition-colors"
                        title="Marcar como resuelto"
                        aria-label="Marcar como resuelto"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); dismissReport(report.id); }} className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors" title="Descartar" aria-label="Descartar"><XCircle className="w-5 h-5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteReport(report.id); }} className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors" title="Eliminar reporte" aria-label="Eliminar reporte"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  )}
                </div>
              </div>

              {selectedReport?.id === report.id && (
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="relative w-full bg-gray-100 dark:bg-gray-700">
                          <div className="w-full h-full aspect-[4/3]">
                            <img src={`https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=1200&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&sat=0&item=${report.itemId}`} alt={report.itemTitle} className="w-full h-full object-cover rounded-tl-2xl rounded-tr-2xl lg:rounded-tr-none lg:rounded-bl-2xl" />
                          </div>
                        </div>
                        <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{report.itemTitle}</h2>
                            <Badge variant="default">Publicación relacionada</Badge>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {report.itemId}</p>
                          </div>
                          <div className="ml-4">
                            <div className={`px-3 py-1 rounded-md text-sm ${report.status === 'pending' ? 'bg-amber-100 text-amber-700' : report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{report.status === 'pending' ? 'Pendiente' : report.status === 'resolved' ? 'Resuelto' : 'Descartado'}</div>
                          </div>
                        </div>

                        <div className="mt-4 text-gray-700 dark:text-gray-300">
                          <p className="mb-3">Aquí puedes ver la información completa de la publicación relacionada con este reporte.</p>
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Ubicación</p>
                              <p className="text-xs md:text-sm">Edificio 401 - Aula 301</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha</p>
                              <p className="text-sm">15 de Enero, 2025</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reportado por</p>
                              <p className="text-sm">{report.reporterName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Descripción del reporte</p>
                              <p className="text-sm">{report.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-2">
                          {report.status === 'pending' && (
                            <>
                              <button onClick={() => setConfirmOpen(true)} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">Resolver</button>
                              <button onClick={() => dismissReport(report.id)} className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">Descartar</button>
                            </>
                          )}

                          <button onClick={() => deleteReport(report.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">Eliminar reporte</button>
                          <button onClick={() => clearSelection()} className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm">Cerrar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No hay Denuncias</h3>
            <p className="text-gray-600 dark:text-gray-400">No se encontraron denuncias con el filtro seleccionado</p>
          </div>
        )}
      </Card>

      {/* Confirm dialog for resolving (deleting the publication) */}
      <ConfirmDialog
        open={Boolean(confirmOpen)}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setConfirmTarget(null);
        }}
        title="Eliminar publicación"
        description="Al resolver la denuncia se eliminará la publicación relacionada. ¿Deseas continuar?"
        confirmLabel="Eliminar publicación"
        cancelLabel="Cancelar"
        onConfirm={() => {
          const target = confirmTarget ?? selectedReport;
          if (target) {
            setReports((prev) => prev.filter((r) => r.itemId !== target.itemId));
            // if the expanded panel was the same report, close it
            if (selectedReport?.id === target.id) clearSelection();
          }
          setConfirmOpen(false);
          setConfirmTarget(null);
        }}
      />
    </PageTemplate>
  );
}

