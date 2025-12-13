import { useState, useEffect, useCallback } from 'react';
import { ActivityLogRecord, ActivityLogResponse } from '../types';
import { getAdminActivityLog, GetActivityLogParams } from '../services/adminService';
import useGlobalStore from '../store/useGlobalStore';

export interface UseAdminActivityLogReturn {
  activities: ActivityLogRecord[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const DEFAULT_LIMIT = 10;

/**
 * Hook para obtener y manejar la actividad reciente del sistema
 * Soporta paginación y carga incremental
 */
export function useAdminActivityLog(
  initialLimit: number = DEFAULT_LIMIT
): UseAdminActivityLogReturn {
  const [activities, setActivities] = useState<ActivityLogRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = useGlobalStore((s) => s.apiUrl);
  const limit = initialLimit;

  const fetchActivities = useCallback(
    async (params: GetActivityLogParams, append: boolean = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: ActivityLogResponse = await getAdminActivityLog(apiUrl, params);

        if (append) {
          setActivities((prev) => [...prev, ...response.items]);
        } else {
          setActivities(response.items);
        }

        setTotal(response.total);
        setOffset(response.offset + response.items.length);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar la actividad reciente';
        setError(errorMessage);
        console.error('Error fetching admin activity log:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl]
  );

  // Carga inicial
  useEffect(() => {
    fetchActivities({ limit, offset: 0 });
  }, [fetchActivities, limit]);

  // Refrescar desde el inicio
  const refetch = useCallback(async () => {
    setOffset(0);
    await fetchActivities({ limit, offset: 0 });
  }, [fetchActivities, limit]);

  // Cargar más elementos
  const loadMore = useCallback(async () => {
    if (!isLoading && offset < total) {
      await fetchActivities({ limit, offset }, true);
    }
  }, [fetchActivities, isLoading, limit, offset, total]);

  const hasMore = offset < total;

  return {
    activities,
    total,
    isLoading,
    error,
    refetch,
    loadMore,
    hasMore,
  };
}

export default useAdminActivityLog;
