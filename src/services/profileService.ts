import { apiFetch } from './api';

/**
 * Interfaz para los datos del usuario (sincronizada con types/index.ts)
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  user_id?: string;
  phone_number?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  profile_picture?: string;
  created_at?: string;
}

/**
 * Interfaz para actualizar el perfil
 */
export interface UpdateProfileData {
  phone_number?: string;
  name?: string;
}

/**
 * Servicio para gestión de perfil de usuario
 */
export const profileService = {
  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(apiBase: string): Promise<UserProfile> {
    return apiFetch<UserProfile>('/user/profile', {
      method: 'GET',
      baseUrl: apiBase,
    });
  },

  /**
   * Actualiza los datos del perfil del usuario
   */
  async updateProfile(apiBase: string, data: UpdateProfileData): Promise<UserProfile | null> {
    return apiFetch<UserProfile>('/user/profile/update', {
      method: 'PATCH',
      baseUrl: apiBase,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualiza el número de teléfono del usuario
   * @deprecated Usar updateProfile en su lugar
   */
  async updatePhone(apiBase: string, phone: string): Promise<UserProfile | null> {
    return this.updateProfile(apiBase, { phone_number: phone });
  },
};
