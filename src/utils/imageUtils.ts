/**
 * Construye la URL completa para acceder a una imagen del backend
 * @param filename Nombre del archivo de la imagen (ej: "1764387561762-198788964.png")
 * @param apiBase URL base de la API
 * @param userId ID del usuario
 * @returns URL completa para acceder a la imagen, o undefined si no hay filename
 */
export function buildImageUrl(
  filename: string | undefined | null,
  apiBase: string,
  userId: string | number
): string | undefined {
  if (!filename) {
    return undefined;
  }

  // Remover barras iniciales si existen
  const normalizedBase = apiBase.replace(/\/$/, '');
  const normalizedFilename = filename.replace(/^\//, '');

  return `${normalizedBase}/user/${userId}/images/${normalizedFilename}`;
}

