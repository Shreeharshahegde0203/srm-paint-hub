
import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

const cache = new Map<string, CacheEntry<any>>();

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const cached = cache.get(key);

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cached && now < cached.expiry) {
      setData(cached.data);
      setLoading(false);
      return cached.data;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      cache.set(key, {
        data: result,
        timestamp: now,
        expiry: now + ttl
      });
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  const invalidateCache = useCallback(() => {
    cache.delete(key);
    fetchData(true);
  }, [key, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    invalidateCache
  };
}

export const clearAllCache = () => {
  cache.clear();
};
