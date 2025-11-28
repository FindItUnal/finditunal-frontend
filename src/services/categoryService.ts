import { apiFetch } from './api';

/**
 * Interfaz para las categorías que vienen del backend
 */
export interface Category {
  category_id: number;
  name: string;
}

/**
 * Servicio para gestión de categorías
 */
export const categoryService = {
  /**
   * Obtiene todas las categorías
   */
  async getAllCategories(apiBase: string, userId: string | number): Promise<Category[]> {
    return apiFetch<Category[]>(`/user/${userId}/categories`, {
      method: 'GET',
      baseUrl: apiBase,
    });
  },
};

