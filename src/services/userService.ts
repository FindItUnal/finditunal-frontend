/**
 * @deprecated Usar profileService.getProfile en su lugar
 * Este archivo mantiene compatibilidad hacia atrás
 */
import { profileService } from './profileService';
import { authService } from './authService';

export async function getProfile(apiBase: string) {
  return profileService.getProfile(apiBase);
}

export async function updatePhone(apiBase: string, phone: string) {
  return profileService.updatePhone(apiBase, phone);
}

export async function logoutRequest(apiBase: string) {
  return authService.logout(apiBase);
}
