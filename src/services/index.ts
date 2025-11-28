/**
 * Exportar todos los servicios de la aplicación
 */
export { apiFetch } from './api';
export { authService } from './authService';
export { profileService } from './profileService';
export type { UserProfile, UpdateProfileData } from './profileService';
export { objectService, mapBackendObjectToItem } from './objectService';
export type { BackendObject, SearchObjectsParams } from './objectService';
export { categoryService } from './categoryService';
export type { Category } from './categoryService';
export { locationService } from './locationService';
export type { Location } from './locationService';
export { reportService } from './reportService';
export type { CreateReportData, UpdateReportData, UserReport } from './reportService';

// Mantener compatibilidad con código antiguo (deprecado)
export { getProfile, updatePhone, logoutRequest } from './userService';
