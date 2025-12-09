import { apiFetch } from './api';
import { 
  AdminDashboardStats, 
  ActivityLogResponse, 
  AdminUsersResponse,
  UserDetailWithStats,
  ComplaintRecord,
  ComplaintStatus,
  ComplaintReason,
  UpdateComplaintInput,
  ComplaintActionResponse,
} from '../types';

/**
 * Servicio para operaciones de administración
 * Contiene todas las llamadas a la API relacionadas con el panel de admin
 */

/**
 * Obtiene las estadísticas del dashboard de administración
 * @param apiUrl - URL base de la API
 * @returns Estadísticas del dashboard
 */
export async function getAdminDashboardStats(apiUrl: string): Promise<AdminDashboardStats> {
  return apiFetch<AdminDashboardStats>('/user/admin/dashboard-stats', {
    baseUrl: apiUrl,
    method: 'GET',
  });
}

/**
 * Parámetros para obtener actividad reciente
 */
export interface GetActivityLogParams {
  limit?: number;
  offset?: number;
}

/**
 * Obtiene la actividad reciente del sistema
 * @param apiUrl - URL base de la API
 * @param params - Parámetros de paginación
 * @returns Lista paginada de actividad
 */
export async function getAdminActivityLog(
  apiUrl: string,
  params: GetActivityLogParams = {}
): Promise<ActivityLogResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.limit !== undefined) {
    searchParams.set('limit', params.limit.toString());
  }
  if (params.offset !== undefined) {
    searchParams.set('offset', params.offset.toString());
  }

  const queryString = searchParams.toString();
  const endpoint = `/user/admin/activity-log${queryString ? `?${queryString}` : ''}`;

  return apiFetch<ActivityLogResponse>(endpoint, {
    baseUrl: apiUrl,
    method: 'GET',
  });
}

/**
 * Obtiene la lista de usuarios para el panel de admin
 * @param apiUrl - URL base de la API
 * @returns Lista de usuarios con totales
 */
export async function getAdminUsers(apiUrl: string): Promise<AdminUsersResponse> {
  return apiFetch<AdminUsersResponse>('/user/admin/users', {
    baseUrl: apiUrl,
    method: 'GET',
  });
}

/**
 * Obtiene el detalle de un usuario específico
 * @param apiUrl - URL base de la API
 * @param userId - ID del usuario
 * @returns Detalle del usuario con estadísticas
 */
export async function getAdminUserDetail(
  apiUrl: string, 
  userId: string
): Promise<UserDetailWithStats> {
  return apiFetch<UserDetailWithStats>(`/user/admin/users/${userId}`, {
    baseUrl: apiUrl,
    method: 'GET',
  });
}

/**
 * Banea un usuario (anonimiza datos y desactiva)
 * @param apiUrl - URL base de la API
 * @param userId - ID del usuario a banear
 */
export async function banAdminUser(
  apiUrl: string, 
  userId: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/user/admin/users/${userId}/ban`, {
    baseUrl: apiUrl,
    method: 'PATCH',
  });
}

// =============================================
// COMPLAINTS (Denuncias)
// =============================================

/**
 * Parámetros para filtrar denuncias
 */
export interface GetComplaintsParams {
  status?: ComplaintStatus;
  reason?: ComplaintReason;
  report_id?: number;
}

/**
 * Obtiene la lista de denuncias para el panel de admin
 * @param apiUrl - URL base de la API
 * @param params - Filtros opcionales
 * @returns Lista de denuncias
 */
export async function getAdminComplaints(
  apiUrl: string,
  params: GetComplaintsParams = {}
): Promise<ComplaintRecord[]> {
  const searchParams = new URLSearchParams();
  
  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.reason) {
    searchParams.set('reason', params.reason);
  }
  if (params.report_id !== undefined) {
    searchParams.set('report_id', params.report_id.toString());
  }

  const queryString = searchParams.toString();
  const endpoint = `/user/admin/complaints${queryString ? `?${queryString}` : ''}`;

  return apiFetch<ComplaintRecord[]>(endpoint, {
    baseUrl: apiUrl,
    method: 'GET',
  });
}

/**
 * Obtiene el detalle de una denuncia específica
 * @param apiUrl - URL base de la API
 * @param complaintId - ID de la denuncia
 * @returns Detalle de la denuncia
 */
export async function getAdminComplaintDetail(
  apiUrl: string,
  complaintId: number
): Promise<ComplaintRecord> {
  return apiFetch<ComplaintRecord>(`/user/admin/complaints/${complaintId}`, {
    baseUrl: apiUrl,
    method: 'GET',
  });
}

/**
 * Actualiza el estado de una denuncia
 * @param apiUrl - URL base de la API
 * @param complaintId - ID de la denuncia
 * @param input - Datos a actualizar (status y/o admin_notes)
 */
export async function updateComplaintStatus(
  apiUrl: string,
  complaintId: number,
  input: UpdateComplaintInput
): Promise<ComplaintActionResponse> {
  return apiFetch<ComplaintActionResponse>(`/user/admin/complaints/${complaintId}`, {
    baseUrl: apiUrl,
    method: 'PATCH',
    body: input,
  });
}

/**
 * Descarta una denuncia (marca como resuelta sin eliminar el reporte)
 * @param apiUrl - URL base de la API
 * @param complaintId - ID de la denuncia
 * @param adminNotes - Notas del administrador
 */
export async function discardComplaint(
  apiUrl: string,
  complaintId: number,
  adminNotes: string
): Promise<ComplaintActionResponse> {
  return apiFetch<ComplaintActionResponse>(`/user/admin/complaints/${complaintId}/discard`, {
    baseUrl: apiUrl,
    method: 'PATCH',
    body: { admin_notes: adminNotes },
  });
}

/**
 * Resuelve una denuncia y elimina el reporte denunciado
 * @param apiUrl - URL base de la API
 * @param complaintId - ID de la denuncia
 * @param adminNotes - Notas del administrador
 */
export async function resolveComplaintAndDelete(
  apiUrl: string,
  complaintId: number,
  adminNotes: string
): Promise<ComplaintActionResponse> {
  return apiFetch<ComplaintActionResponse>(`/user/admin/complaints/${complaintId}/resolve`, {
    baseUrl: apiUrl,
    method: 'PATCH',
    body: { admin_notes: adminNotes },
  });
}

/**
 * Servicio de administración como objeto para uso más estructurado
 */
export const adminService = {
  getDashboardStats: getAdminDashboardStats,
  getActivityLog: getAdminActivityLog,
  getUsers: getAdminUsers,
  getUserDetail: getAdminUserDetail,
  banUser: banAdminUser,
  // Complaints
  getComplaints: getAdminComplaints,
  getComplaintDetail: getAdminComplaintDetail,
  updateComplaintStatus: updateComplaintStatus,
  discardComplaint: discardComplaint,
  resolveComplaint: resolveComplaintAndDelete,
};

export default adminService;
