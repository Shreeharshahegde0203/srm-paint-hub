
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useCallback } from 'react';

interface GlobalCacheOptions {
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
}

export function useGlobalCache<T>(
  key: string | string[],
  fetcher: () => Promise<T>,
  options: GlobalCacheOptions = {}
) {
  const queryClient = useQueryClient();
  
  const {
    staleTime = 5 * 60 * 1000, // 5 minutes default
    gcTime = 10 * 60 * 1000,   // 10 minutes default
    enabled = true
  } = options;

  const query = useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    staleTime,
    gcTime,
    enabled,
  });

  // Cache invalidation helpers
  const invalidateCache = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
  }, [queryClient, key]);

  const removeFromCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: Array.isArray(key) ? key : [key] });
  }, [queryClient, key]);

  const updateCache = useCallback((data: T) => {
    queryClient.setQueryData(Array.isArray(key) ? key : [key], data);
  }, [queryClient, key]);

  const prefetchData = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: Array.isArray(key) ? key : [key],
      queryFn: fetcher,
      staleTime,
    });
  }, [queryClient, key, fetcher, staleTime]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
    invalidateCache,
    removeFromCache,
    updateCache,
    prefetchData,
  };
}

// Hook for cache statistics and monitoring
export function useCacheStats() {
  const queryClient = useQueryClient();

  const getCacheStats = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      freshQueries: queries.filter(q => q.state.dataUpdatedAt > Date.now() - 5 * 60 * 1000).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.error).length,
    };
  }, [queryClient]);

  const clearAllCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  return {
    getCacheStats,
    clearAllCache,
  };
}
