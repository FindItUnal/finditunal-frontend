import { QueryClient } from '@tanstack/react-query';

/**
 * Configuración del QueryClient para TanStack Query
 * - Cache de 5 minutos para datos estáticos (categorías, ubicaciones)
 * - Cache de 1 minuto para datos dinámicos (objetos, reportes)
 * - Retry automático configurado
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos" antes de refetch automático
      staleTime: 1 * 60 * 1000, // 1 minuto por defecto
      // Tiempo que los datos permanecen en cache
      gcTime: 5 * 60 * 1000, // 5 minutos (antes era cacheTime)
      // Reintentos automáticos en caso de error
      retry: 2,
      // Refetch cuando la ventana recupera el foco
      refetchOnWindowFocus: true,
      // Refetch cuando se reconecta la red
      refetchOnReconnect: true,
    },
    mutations: {
      // Reintentos para mutations
      retry: 1,
    },
  },
});

