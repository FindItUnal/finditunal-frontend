import { useQuery } from '@tanstack/react-query';
import { objectService, mapBackendObjectToItem, BackendObject } from '../services';
import { Item } from '../types';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';

/**
 * Hook para cargar objetos del dashboard con TanStack Query
 * Cache de 1 minuto ya que son datos dinámicos
 */
export function useObjects() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  return useQuery<Item[]>({
    queryKey: ['objects', apiUrl, user?.id || user?.user_id],
    queryFn: async () => {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      const userId = getUserId(user);
      const backendObjects: BackendObject[] = await objectService.getAllObjects(apiUrl, userId);
      // Mapear objetos del backend al formato Item del frontend
      return backendObjects.map((obj) => mapBackendObjectToItem(obj, apiUrl, userId));
    },
    enabled: !!user, // Solo ejecutar si hay usuario
    staleTime: 1 * 60 * 1000, // 1 minuto - datos dinámicos
    gcTime: 5 * 60 * 1000, // 5 minutos en cache
  });
}

