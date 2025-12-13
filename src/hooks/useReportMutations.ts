import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService, CreateReportData, UpdateReportData, Category, Location } from '../services';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';

/**
 * Hook para mutations de reportes (crear, actualizar, eliminar)
 * Incluye invalidación automática de queries relacionadas
 */
export function useReportMutations() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const queryClient = useQueryClient();

  const userId = user ? getUserId(user) : null;

  // Mutation para crear reporte
  const createReport = useMutation({
    mutationFn: async (data: CreateReportData) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return reportService.createReport(apiUrl, userId, data);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['objects', apiUrl, userId] });
      queryClient.invalidateQueries({ queryKey: ['userReports', apiUrl, userId] });
    },
  });

  // Mutation para actualizar reporte
  const updateReport = useMutation({
    mutationFn: async ({ reportId, data }: { reportId: number; data: UpdateReportData }) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return reportService.updateReport(apiUrl, userId, reportId, data);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['objects', apiUrl, userId] });
      queryClient.invalidateQueries({ queryKey: ['userReports', apiUrl, userId] });
      queryClient.invalidateQueries({ queryKey: ['object', apiUrl, userId] });
    },
  });

  // Mutation para eliminar reporte
  const deleteReport = useMutation({
    mutationFn: async (reportId: number) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return reportService.deleteReport(apiUrl, userId, reportId);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['objects', apiUrl, userId] });
      queryClient.invalidateQueries({ queryKey: ['userReports', apiUrl, userId] });
      queryClient.invalidateQueries({ queryKey: ['object', apiUrl, userId] });
    },
  });

  // Mutation para marcar reporte como entregado
  const markAsDelivered = useMutation({
    mutationFn: async (reportId: number) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return reportService.markAsDelivered(apiUrl, userId, reportId);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['objects', apiUrl, userId] });
      queryClient.invalidateQueries({ queryKey: ['userReports', apiUrl, userId] });
      queryClient.invalidateQueries({ queryKey: ['object', apiUrl, userId] });
    },
  });

  /**
   * Helper para crear/actualizar reporte desde el formato del formulario
   */
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
  }, categories: Category[], locations: Location[]) => {
    if (!userId) throw new Error('Usuario no autenticado');

    // Convertir nombres a IDs
    const categoryId = reportService.findCategoryId(data.category, categories);
    const locationId = reportService.findLocationId(data.location, locations);

    if (!categoryId || !locationId) {
      throw new Error('Categoría o ubicación inválida');
    }

    // Convertir tipo del frontend al formato del backend
    const status: 'perdido' | 'encontrado' = data.type === 'lost' ? 'perdido' : 'encontrado';

    const reportData: CreateReportData | UpdateReportData = {
      category_id: categoryId,
      location_id: locationId,
      title: data.title,
      description: data.description,
      status: status,
      date_lost_or_found: data.found_date,
      contact_method: data.contact_method,
      image: data.image,
    };

    if (data.reportId) {
      // Modo edición
      const reportId = parseInt(data.reportId, 10);
      return updateReport.mutateAsync({ reportId, data: reportData });
    } else {
      // Modo creación
      return createReport.mutateAsync(reportData as CreateReportData);
    }
  };

  return {
    createReport,
    updateReport,
    deleteReport,
    markAsDelivered,
    handlePublish,
    isPending: createReport.isPending || updateReport.isPending || deleteReport.isPending || markAsDelivered.isPending,
  };
}

