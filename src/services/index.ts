/**
 * Exportar todos los servicios de la aplicación
 */
export { apiFetch } from './api';
export { authService } from './authService';
export { profileService } from './profileService';
export type { UserProfile, UpdateProfileData } from './profileService';

// Mantener compatibilidad con código antiguo (deprecado)
export { getProfile, updatePhone, logoutRequest } from './userService';
