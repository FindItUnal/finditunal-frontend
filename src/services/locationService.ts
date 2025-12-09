import { apiFetch } from './api';

/**
 * Interfaz para las ubicaciones que vienen del backend
 */
export interface Location {
  location_id: number;
  name: string;
}

/**
 * Servicio para gestión de ubicaciones
 */
export const locationService = {
  /**
   * Obtiene todas las ubicaciones
   */
  async getAllLocations(apiBase: string, userId: string | number): Promise<Location[]> {
    return apiFetch<Location[]>(`/user/${userId}/locations`, {
      method: 'GET',
      baseUrl: apiBase,
    });
  },
};

