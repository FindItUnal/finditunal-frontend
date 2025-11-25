import { apiFetch } from './api';

/**
 * Servicio para autenticación
 */
export const authService = {
  /**
   * Cierra la sesión del usuario
   */
  async logout(apiBase: string): Promise<void> {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        baseUrl: apiBase,
      });
    } catch (error) {
      // Ignorar errores de logout
      console.debug('Logout error:', error);
    }
  },
};
