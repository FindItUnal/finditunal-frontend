import { useMutation } from '@tanstack/react-query';
import { complaintService, CreateComplaintPayload } from '../services/complaintService';
import useUserStore from '../store/useUserStore';
import useGlobalStore from '../store/useGlobalStore';
import { getUserId } from '../utils/userUtils';

/**
 * Hook para mutations de denuncias (complaints)
 */
export function useComplaintMutation() {
  const user = useUserStore((s) => s.user);
  const apiUrl = useGlobalStore((s) => s.apiUrl);

  const userId = user ? getUserId(user) : null;

  // Mutation para crear denuncia
  const submitComplaint = useMutation({
    mutationFn: async ({
      reportId,
      payload,
    }: {
      reportId: number;
      payload: CreateComplaintPayload;
    }) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return complaintService.submitComplaint(apiUrl, userId, reportId, payload);
    },
  });

  return {
    submitComplaint,
    isPending: submitComplaint.isPending,
    isError: submitComplaint.isError,
    error: submitComplaint.error,
  };
}


