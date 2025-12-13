import { User } from '../types';

/**
 * Obtiene el user_id del usuario autenticado
 * @param user Usuario del store
 * @returns user_id o id del usuario
 * @throws Error si el usuario no está autenticado
 */
export function getUserId(user: User | null): string | number {
  if (!user) {
    throw new Error('Usuario no autenticado');
  }
  // Usar user_id si está disponible, sino usar id
  return user.user_id || user.id;
}

