import { useState, useEffect, useCallback } from 'react';
import { ComplaintRecord, ComplaintStatus, ComplaintReason } from '../types';
import { 
  getAdminComplaints, 
  updateComplaintStatus, 
  discardComplaint, 
  resolveComplaintAndDelete 
} from '../services';
import useGlobalStore from '../store/useGlobalStore';

export interface ComplaintFilters {
  status?: ComplaintStatus;
  reason?: ComplaintReason;
}

interface UseAdminComplaintsReturn {
  complaints: ComplaintRecord[];
  loading: boolean;
  error: string | null;
  filters: ComplaintFilters;
  setFilters: (filters: ComplaintFilters) => void;
  refetch: () => Promise<void>;
  // Acciones
  markInReview: (complaintId: number) => Promise<boolean>;
  discard: (complaintId: number, notes: string) => Promise<boolean>;
  resolve: (complaintId: number, notes: string) => Promise<boolean>;
  actionLoading: number | null;
  // Contadores
  pendingCount: number;
  totalCount: number;
}

/**
 * Hook para manejar las denuncias del panel de administración
 * Incluye funcionalidad de filtrado y acciones (marcar en revisión, descartar, resolver)
 */
export function useAdminComplaints(): UseAdminComplaintsReturn {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComplaintFilters>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminComplaints(apiUrl, filters);
      setComplaints(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar denuncias';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, filters]);

  // Marcar denuncia como "en revisión"
  const markInReview = useCallback(async (complaintId: number): Promise<boolean> => {
    try {
      setActionLoading(complaintId);
      await updateComplaintStatus(apiUrl, complaintId, { status: 'in_review' });
      
      // Actualizar estado local
      setComplaints(prev => 
        prev.map(c => 
          c.complaint_id === complaintId 
            ? { ...c, status: 'in_review' as ComplaintStatus }
            : c
        )
      );
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar denuncia';
      setError(message);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, [apiUrl]);

  // Descartar denuncia (sin eliminar el reporte)
  const discard = useCallback(async (complaintId: number, notes: string): Promise<boolean> => {
    try {
      setActionLoading(complaintId);
      await discardComplaint(apiUrl, complaintId, notes);
      
      // Actualizar estado local
      setComplaints(prev => 
        prev.map(c => 
          c.complaint_id === complaintId 
            ? { ...c, status: 'resolved' as ComplaintStatus, admin_notes: notes }
            : c
        )
      );
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al descartar denuncia';
      setError(message);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, [apiUrl]);

  // Resolver denuncia y eliminar reporte
  const resolve = useCallback(async (complaintId: number, notes: string): Promise<boolean> => {
    try {
      setActionLoading(complaintId);
      await resolveComplaintAndDelete(apiUrl, complaintId, notes);
      
      // Actualizar estado local
      setComplaints(prev => 
        prev.map(c => 
          c.complaint_id === complaintId 
            ? { ...c, status: 'resolved' as ComplaintStatus, admin_notes: notes }
            : c
        )
      );
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al resolver denuncia';
      setError(message);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Contadores
  const pendingCount = complaints.filter(c => c.status === 'pending' || c.status === 'in_review').length;
  const totalCount = complaints.length;

  return {
    complaints,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchComplaints,
    markInReview,
    discard,
    resolve,
    actionLoading,
    pendingCount,
    totalCount,
  };
}
