import { apiFetch } from './api';
import { Category } from './categoryService';
import { Location } from './locationService';
import { Item } from '../types';
import { buildImageUrl } from '../utils';

/**
 * Datos para crear un reporte
 */
export interface CreateReportData {
  category_id: number;
  location_id: number;
  title: string;
  description?: string;
  status: 'perdido' | 'encontrado';
  date_lost_or_found: string; // YYYY-MM-DD
  contact_method: string;
  image?: File; // Se envía al backend como 'images' (array) aunque internamente solo se maneje una imagen
}

/**
 * Datos para actualizar un reporte (todos los campos opcionales)
 */
export interface UpdateReportData {
  category_id?: number;
  location_id?: number;
  title?: string;
  description?: string;
  status?: 'perdido' | 'encontrado';
  date_lost_or_found?: string; // YYYY-MM-DD
  contact_method?: string;
  image?: File; // Se envía al backend como 'images' (array) aunque internamente solo se maneje una imagen
}

/**
 * Estructura del reporte que viene del backend
 */
export interface UserReport {
  report_id: number;
  user_id: number;
  category_id: number;
  location_id: number;
  title: string;
  description?: string;
  status: 'perdido' | 'encontrado';
  date_lost_or_found: string | Date;
  contact_method: string;
  created_at: string | Date;
  updated_at: string | Date;
  image_url?: string; // Puede venir si el backend lo incluye
}

/**
 * Helper para hacer fetch con FormData
 */
async function fetchWithFormData<T = unknown>(
  endpoint: string,
  formData: FormData,
  baseUrl: string
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl.replace(/\/$/, '')}${normalizedEndpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // No establecer Content-Type, el navegador lo hará automáticamente con el boundary
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message ||
        errorData?.error ||
        `HTTP Error ${response.status}: ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/**
 * Helper para hacer PATCH con FormData
 */
async function patchWithFormData<T = unknown>(
  endpoint: string,
  formData: FormData,
  baseUrl: string
): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl.replace(/\/$/, '')}${normalizedEndpoint}`;

  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message ||
        errorData?.error ||
        `HTTP Error ${response.status}: ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/**
 * Servicio para gestión de reportes (objetos perdidos/encontrados)
 */
export const reportService = {
  /**
   * Crea un nuevo reporte
   */
  async createReport(
    apiBase: string,
    userId: string | number,
    data: CreateReportData
  ): Promise<{ message: string }> {
    const formData = new FormData();
    
    // Agregar campos del formulario
    formData.append('category_id', data.category_id.toString());
    formData.append('location_id', data.location_id.toString());
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('status', data.status);
    formData.append('date_lost_or_found', data.date_lost_or_found);
    formData.append('contact_method', data.contact_method);

    // Agregar imagen si existe (el backend espera 'images' como array)
    if (data.image) {
      formData.append('images', data.image);
    }

    return fetchWithFormData<{ message: string }>(`/user/${userId}/reports`, formData, apiBase);
  },

  /**
   * Actualiza un reporte existente
   */
  async updateReport(
    apiBase: string,
    userId: string | number,
    reportId: number,
    data: UpdateReportData
  ): Promise<{ message: string }> {
    const formData = new FormData();

    // Agregar solo los campos que están presentes
    if (data.category_id !== undefined) {
      formData.append('category_id', data.category_id.toString());
    }
    if (data.location_id !== undefined) {
      formData.append('location_id', data.location_id.toString());
    }
    if (data.title !== undefined) {
      formData.append('title', data.title);
    }
    if (data.description !== undefined) {
      formData.append('description', data.description);
    }
    if (data.status !== undefined) {
      formData.append('status', data.status);
    }
    if (data.date_lost_or_found !== undefined) {
      formData.append('date_lost_or_found', data.date_lost_or_found);
    }
    if (data.contact_method !== undefined) {
      formData.append('contact_method', data.contact_method);
    }

    // Agregar imagen si existe (el backend espera 'images' como array)
    // Nota: El endpoint PATCH actualmente no soporta subir imágenes, pero dejamos el nombre correcto para cuando se implemente
    if (data.image) {
      formData.append('images', data.image);
    }

    return patchWithFormData<{ message: string }>(
      `/user/${userId}/reports/${reportId}`,
      formData,
      apiBase
    );
  },

  /**
   * Convierte el nombre de una categoría a su ID
   */
  findCategoryId(categoryName: string, categories: Category[]): number | null {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.category_id : null;
  },

  /**
   * Convierte el nombre de una ubicación a su ID
   */
  findLocationId(locationName: string, locations: Location[]): number | null {
    const location = locations.find((loc) => loc.name === locationName);
    return location ? location.location_id : null;
  },

  /**
   * Obtiene todas las imágenes de un reporte
   */
  async getReportImages(
    apiBase: string,
    userId: string | number,
    reportId: number
  ): Promise<{ images: Array<{ filename: string; url: string }> }> {
    return apiFetch<{ images: Array<{ filename: string; url: string }> }>(
      `/user/${userId}/reports/${reportId}/images`,
      {
        method: 'GET',
        baseUrl: apiBase,
      }
    );
  },

  /**
   * Obtiene todos los reportes del usuario y enriquece cada reporte con su imagen
   */
  async getUserReports(apiBase: string, userId: string | number): Promise<UserReport[]> {
    const reports = await apiFetch<UserReport[]>(`/user/${userId}/reports`, {
      method: 'GET',
      baseUrl: apiBase,
    });

    // Obtener la primera imagen de cada reporte para incluirla en image_url
    const reportsWithImages = await Promise.all(
      reports.map(async (report) => {
        try {
          const imagesData = await this.getReportImages(apiBase, userId, report.report_id);
          if (imagesData.images && imagesData.images.length > 0) {
            return {
              ...report,
              image_url: imagesData.images[0].filename, // Usar el primer filename
            };
          }
        } catch (error) {
          // Si hay error al obtener imágenes, simplemente no agregar image_url
          console.warn(`No se pudieron obtener imágenes para reporte ${report.report_id}:`, error);
        }
        return report;
      })
    );

    return reportsWithImages;
  },

  /**
   * Elimina un reporte
   */
  async deleteReport(
    apiBase: string,
    userId: string | number,
    reportId: number
  ): Promise<{ message: string }> {
    return apiFetch<{ message: string }>(`/user/${userId}/reports/${reportId}`, {
      method: 'DELETE',
      baseUrl: apiBase,
    });
  },

  /**
   * Mapea un reporte del backend al formato Item del frontend
   * @param report Reporte del backend
   * @param categories Lista de categorías para mapear IDs a nombres
   * @param locations Lista de ubicaciones para mapear IDs a nombres
   * @param apiBase URL base de la API (opcional, para construir URLs de imágenes)
   */
  mapUserReportToItem(
    report: UserReport,
    categories: Category[],
    locations: Location[],
    apiBase?: string
  ): Item {
    // Convertir status del backend al formato del frontend
    const statusMap: Record<'perdido' | 'encontrado', 'lost' | 'found'> = {
      perdido: 'lost',
      encontrado: 'found',
    };

    // Buscar nombres de categoría y ubicación
    const category = categories.find((cat) => cat.category_id === report.category_id);
    const location = locations.find((loc) => loc.location_id === report.location_id);

    // Formatear fecha
    const date =
      report.date_lost_or_found instanceof Date
        ? report.date_lost_or_found.toISOString().split('T')[0]
        : typeof report.date_lost_or_found === 'string'
        ? report.date_lost_or_found.split('T')[0]
        : new Date().toISOString().split('T')[0];

    return {
      id: report.report_id.toString(),
      title: report.title,
      description: report.description || '',
      category: category?.name || 'Sin categoría',
      imageUrl: apiBase 
        ? buildImageUrl(report.image_url, apiBase, report.user_id)
        : report.image_url,
      location: location?.name || 'Sin ubicación',
      date: date,
      status: statusMap[report.status] || 'found',
      userId: report.user_id.toString(),
      userName: '', // No viene del backend
      createdAt: report.created_at instanceof Date
        ? report.created_at.toISOString()
        : typeof report.created_at === 'string'
        ? report.created_at
        : new Date().toISOString(),
      contact_method: report.contact_method || '',
    };
  },
};

