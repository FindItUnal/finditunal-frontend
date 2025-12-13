import { useState, useEffect, useCallback } from 'react';
import { AdminDashboardStats } from '../types';
import { getAdminDashboardStats } from '../services/adminService';
import useGlobalStore from '../store/useGlobalStore';

export interface UseAdminDashboardStatsReturn {
  stats: AdminDashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener y manejar las estadísticas del dashboard de admin
 * Maneja el estado de carga, errores y permite refrescar los datos
 */
export function useAdminDashboardStats(): UseAdminDashboardStatsReturn {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAdminDashboardStats(apiUrl);
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las estadísticas';
      setError(errorMessage);
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

export default useAdminDashboardStats;
