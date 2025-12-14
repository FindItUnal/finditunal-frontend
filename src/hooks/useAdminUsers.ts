import { useState, useEffect, useCallback } from 'react';
import { AdminUserSummary } from '../types';
import { getAdminUsers, banAdminUser, unbanAdminUser } from '../services';
import useGlobalStore from '../store/useGlobalStore';

interface UseAdminUsersReturn {
  users: AdminUserSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  banUser: (userId: string) => Promise<boolean>;
  unbanUser: (userId: string) => Promise<boolean>;
  actionUserId: string | null;
}

/**
 * Hook para manejar la lista de usuarios del panel de administración
 * Incluye funcionalidad de carga, recarga y baneo de usuarios
 */
export function useAdminUsers(): UseAdminUsersReturn {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUsers(apiUrl);
      setUsers(data.users);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const banUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      setActionUserId(userId);
      await banAdminUser(apiUrl, userId);
      
      // Actualizar el estado local del usuario baneado (is_active = 2)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId 
            ? { ...user, is_active: 2 }
            : user
        )
      );
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al banear usuario';
      setError(message);
      return false;
    } finally {
      setActionUserId(null);
    }
  }, [apiUrl]);

  const unbanUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      setActionUserId(userId);
      await unbanAdminUser(apiUrl, userId);
      
      // Actualizar el estado local del usuario desbaneado (is_active = 1)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId 
            ? { ...user, is_active: 1 }
            : user
        )
      );
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al desbanear usuario';
      setError(message);
      return false;
    } finally {
      setActionUserId(null);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    banUser,
    unbanUser,
    actionUserId,
  };
}
