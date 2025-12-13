import { useQuery } from '@tanstack/react-query';
import { locationService, Location } from '../services';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';

/**
 * Hook para cargar ubicaciones con TanStack Query
 * Cache de 5 minutos ya que son datos relativamente estáticos
 */
export function useLocations() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  return useQuery<Location[]>({
    queryKey: ['locations', apiUrl, user?.id || user?.user_id],
    queryFn: async () => {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      const userId = getUserId(user);
      return locationService.getAllLocations(apiUrl, userId);
    },
    enabled: !!user, // Solo ejecutar si hay usuario
    staleTime: 5 * 60 * 1000, // 5 minutos - datos estáticos
    gcTime: 10 * 60 * 1000, // 10 minutos en cache
  });
}

