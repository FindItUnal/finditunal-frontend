import { apiFetch } from './api';

/**
 * Razones de denuncia del frontend
 */
export type FrontendComplaintReason =
  | 'Fraude / estafa'
  | 'Contenido inapropiado'
  | 'Información personal expuesta'
  | 'Objeto no relacionado / spam'
  | 'Otro';

/**
 * Razones de denuncia del backend
 */
export type BackendComplaintReason = 'spam' | 'inappropriate' | 'fraud' | 'other';

/**
 * Payload para crear una denuncia desde el frontend
 */
export interface CreateComplaintPayload {
  reasons: string[]; // Acepta strings genéricos para flexibilidad
  details?: string;
}

/**
 * Payload para enviar al backend
 */
export interface SubmitComplaintData {
  reason: BackendComplaintReason;
  description?: string;
}

/**
 * Respuesta del backend al crear una denuncia
 */
export interface ComplaintResponse {
  complaint_id: number;
  message: string;
}

/**
 * Mapea las razones del frontend a las del backend
 */
const reasonMap: Record<FrontendComplaintReason, BackendComplaintReason> = {
  'Fraude / estafa': 'fraud',
  'Contenido inapropiado': 'inappropriate',
  'Información personal expuesta': 'inappropriate',
  'Objeto no relacionado / spam': 'spam',
  'Otro': 'other',
};

/**
 * Prioridad de razones (mayor prioridad primero)
 */
const reasonPriority: BackendComplaintReason[] = ['fraud', 'inappropriate', 'spam', 'other'];

/**
 * Convierte múltiples razones del frontend a una sola razón del backend
 * Usa la prioridad: fraud > inappropriate > spam > other
 */
function mapReasonsToBackendReason(reasons: string[]): BackendComplaintReason {
  if (reasons.length === 0) {
    return 'other';
  }

  // Mapear todas las razones al backend, filtrando las que no están en el mapa
  const backendReasons = reasons
    .map((r) => reasonMap[r as FrontendComplaintReason])
    .filter((r): r is BackendComplaintReason => r !== undefined);

  if (backendReasons.length === 0) {
    return 'other';
  }

  // Encontrar la razón con mayor prioridad
  for (const priorityReason of reasonPriority) {
    if (backendReasons.includes(priorityReason)) {
      return priorityReason;
    }
  }

  return backendReasons[0];
}

/**
 * Valida y prepara los datos para enviar al backend
 */
function prepareComplaintData(payload: CreateComplaintPayload): SubmitComplaintData {
  const reason = mapReasonsToBackendReason(payload.reasons);

  // Validar descripción: debe tener mínimo 10 caracteres si se proporciona
  let description: string | undefined = payload.details?.trim();

  if (description && description.length < 10) {
    // Si la descripción es muy corta, no la enviamos
    description = undefined;
  }

  // Si la descripción es muy larga, truncarla
  if (description && description.length > 2000) {
    description = description.substring(0, 2000);
  }

  return {
    reason,
    description,
  };
}

/**
 * Servicio para gestión de denuncias (complaints)
 */
export const complaintService = {
  /**
   * Envía una denuncia sobre un reporte
   * @param apiBase URL base de la API
   * @param userId ID del usuario que realiza la denuncia
   * @param reportId ID del reporte que se denuncia
   * @param payload Datos de la denuncia (razones y detalles)
   */
  async submitComplaint(
    apiBase: string,
    userId: string | number,
    reportId: number,
    payload: CreateComplaintPayload
  ): Promise<ComplaintResponse> {
    if (!payload.reasons || payload.reasons.length === 0) {
      throw new Error('Debe seleccionar al menos una razón para la denuncia');
    }

    const data = prepareComplaintData(payload);

    return apiFetch<ComplaintResponse>(`/user/${userId}/reports/${reportId}/complaints`, {
      method: 'POST',
      baseUrl: apiBase,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};

