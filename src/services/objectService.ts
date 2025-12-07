import { apiFetch } from './api';
import { Item } from '../types';
import { buildImageUrl } from '../utils';

/**
 * Interfaz para los objetos que vienen del backend
 */
export interface BackendObject {
  report_id: number;
  title: string;
  description?: string;
  category: string;
  location: string;
  status: 'perdido' | 'encontrado';
  contact_method: string;
  date_lost_or_found: string | Date;
  image_url?: string;
}

/**
 * Mapea un objeto del backend al formato Item del frontend
 * @param backendObject Objeto del backend
 * @param apiBase URL base de la API (opcional, para construir URLs de imágenes)
 * @param userId ID del usuario (opcional, para construir URLs de imágenes)
 */
export function mapBackendObjectToItem(
  backendObject: BackendObject,
  apiBase?: string,
  userId?: string | number
): Item {
  // Convertir status del backend al formato del frontend
  const statusMap: Record<'perdido' | 'encontrado', 'lost' | 'found'> = {
    perdido: 'lost',
    encontrado: 'found',
  };

  // Formatear fecha
  const date = backendObject.date_lost_or_found instanceof Date
    ? backendObject.date_lost_or_found.toISOString().split('T')[0]
    : typeof backendObject.date_lost_or_found === 'string'
    ? backendObject.date_lost_or_found.split('T')[0]
    : new Date().toISOString().split('T')[0];

  return {
    id: backendObject.report_id.toString(),
    title: backendObject.title,
    description: backendObject.description || '',
    category: backendObject.category,
    imageUrl: apiBase && userId 
      ? buildImageUrl(backendObject.image_url, apiBase, userId)
      : backendObject.image_url,
    location: backendObject.location,
    date: date,
    status: statusMap[backendObject.status] || 'found',
    userId: '', // No viene del backend
    userName: '', // No viene del backend
    createdAt: new Date().toISOString(), // No viene del backend, usar fecha actual
    contact_method: backendObject.contact_method || '',
  };
}

/**
 * Parámetros para buscar objetos con filtros
 */
export interface SearchObjectsParams {
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  status?: 'perdido' | 'encontrado';
}

/**
 * Servicio para gestión de objetos perdidos/encontrados
 */
export const objectService = {
  /**
   * Obtiene todos los objetos perdidos/encontrados
   */
  async getAllObjects(apiBase: string, userId: string | number): Promise<BackendObject[]> {
    return apiFetch<BackendObject[]>(`/user/${userId}/objects`, {
      method: 'GET',
      baseUrl: apiBase,
    });
  },

  /**
   * Busca objetos con filtros
   */
  async searchObjects(
    apiBase: string,
    userId: string | number,
    params: SearchObjectsParams
  ): Promise<BackendObject[]> {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('category', params.category);
    if (params.location) queryParams.append('location', params.location);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = `/user/${userId}/objects/filters${queryString ? `?${queryString}` : ''}`;

    return apiFetch<BackendObject[]>(endpoint, {
      method: 'GET',
      baseUrl: apiBase,
    });
  },

  /**
   * Obtiene un objeto específico por su report_id
   */
  async getObjectById(
    apiBase: string,
    userId: string | number,
    reportId: number
  ): Promise<BackendObject> {
    return apiFetch<BackendObject>(`/user/${userId}/objects/filter/${reportId}`, {
      method: 'GET',
      baseUrl: apiBase,
    });
  },
};

