import { apiFetch } from './api';

/**
 * Servicio para autenticación
 */
export const authService = {
  /**
   * Refresca el access token usando el refresh token almacenado en cookies
   */
  async refreshToken(apiBase: string): Promise<void> {
    await apiFetch('/auth/refresh-token', {
      method: 'POST',
      baseUrl: apiBase,
    });
  },

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
