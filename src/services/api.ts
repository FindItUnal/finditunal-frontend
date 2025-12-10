/**
 * Utilidad base para hacer peticiones HTTP
 */

interface FetchOptions extends RequestInit {
  baseUrl?: string;
  _retry?: boolean; // Flag interno para evitar loops infinitos
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Intenta refrescar el access token usando el refresh token
 */
async function refreshAccessToken(baseUrl: string): Promise<void> {
  const url = `${baseUrl.replace(/\/$/, '')}/auth/refresh-token`;
  
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo refrescar el token');
  }
}

/**
 * Wrapper de fetch con configuración por defecto y refresh automático
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { baseUrl, _retry, ...fetchOptions } = options;

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

  // Si recibimos 401 y no es un retry, intentar refrescar el token
  if (response.status === 401 && !_retry && baseUrl) {
    // Evitar que el refresh-token endpoint intente refrescarse a sí mismo
    if (normalizedEndpoint === '/auth/refresh-token') {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.message || 
        errorData?.error || 
        'Token de refresco inválido o expirado'
      );
    }

    if (isRefreshing) {
      // Si ya hay un refresh en progreso, esperar a que termine
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        // Reintentar la petición original
        return apiFetch<T>(endpoint, { ...options, _retry: true });
      });
    }

    isRefreshing = true;

    try {
      await refreshAccessToken(baseUrl);
      processQueue(null);
      isRefreshing = false;
      
      // Reintentar la petición original con el nuevo token
      return apiFetch<T>(endpoint, { ...options, _retry: true });
    } catch (refreshError) {
      processQueue(refreshError as Error);
      isRefreshing = false;
      
      // Si el refresh falló, el token de refresco expiró - redirigir a login
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.message || 
        errorData?.error || 
        'Sesión expirada. Por favor, inicia sesión nuevamente.'
      );
    }
  }

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
