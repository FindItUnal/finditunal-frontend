/**
 * Utilidad base para hacer peticiones HTTP
 */

interface FetchOptions extends RequestInit {
  baseUrl?: string;
}

/**
 * Wrapper de fetch con configuración por defecto
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { baseUrl, ...fetchOptions } = options;

  // Asegurar que el endpoint comience con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Construir URL completa
  const url = baseUrl 
    ? `${baseUrl.replace(/\/$/, '')}${normalizedEndpoint}`
    : normalizedEndpoint;

  // Configuración por defecto
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...fetchOptions.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...fetchOptions });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message || 
      errorData?.error || 
      `HTTP Error ${response.status}: ${response.statusText}`
    );
  }

  // Si la respuesta es 204 No Content, retornar null
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}
