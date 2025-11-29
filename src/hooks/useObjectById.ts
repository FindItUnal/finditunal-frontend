import { useQuery } from '@tanstack/react-query';
import { objectService, mapBackendObjectToItem } from '../services';
import { Item } from '../types';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';

/**
 * Hook para cargar un objeto específico por ID con TanStack Query
 */
export function useObjectById(reportId: number | string | undefined) {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const parsedId = typeof reportId === 'string' ? parseInt(reportId, 10) : reportId;

  return useQuery<Item>({
    queryKey: ['object', apiUrl, user?.id || user?.user_id, parsedId],
    queryFn: async () => {
      if (!user || parsedId === undefined || isNaN(parsedId)) {
        throw new Error('Usuario no autenticado o ID inválido');
      }
      const userId = getUserId(user);
      const backendObject = await objectService.getObjectById(apiUrl, userId, parsedId);
      return mapBackendObjectToItem(backendObject, apiUrl, userId);
    },
    enabled: !!user && parsedId !== undefined && !isNaN(parsedId),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos en cache
  });
}

