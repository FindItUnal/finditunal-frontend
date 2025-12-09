import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services';
import { Item } from '../types';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';
import { useCategories } from './useCategories';
import { useLocations } from './useLocations';

/**
 * Hook para cargar reportes del usuario con TanStack Query
 * Cache de 1 minuto ya que son datos dinámicos
 * Depende de categorías y ubicaciones para mapear correctamente
 */
export function useUserReports() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const { data: categories = [] } = useCategories();
  const { data: locations = [] } = useLocations();

  return useQuery<Item[]>({
    queryKey: ['userReports', apiUrl, user?.id || user?.user_id],
    queryFn: async () => {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      const userId = getUserId(user);
      const reports = await reportService.getUserReports(apiUrl, userId);
      
      // Mapear reportes a Items usando categorías y ubicaciones
      return reports.map((report) =>
        reportService.mapUserReportToItem(report, categories, locations, apiUrl)
      );
    },
    enabled: !!user && categories.length > 0 && locations.length > 0, // Esperar a que se carguen categorías y ubicaciones
    staleTime: 1 * 60 * 1000, // 1 minuto - datos dinámicos
    gcTime: 5 * 60 * 1000, // 5 minutos en cache
  });
}

