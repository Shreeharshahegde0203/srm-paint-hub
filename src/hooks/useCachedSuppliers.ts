
import { supabase } from "@/integrations/supabase/client";
import { useGlobalCache } from "./useGlobalCache";
import { CACHE_CONFIGS } from "@/services/cacheService";
import type { Tables } from "@/integrations/supabase/types";

type Supplier = Tables<"suppliers">;

export function useCachedSuppliers() {
  const { data, isLoading, error, invalidateCache, updateCache } = useGlobalCache<Supplier[]>(
    [CACHE_CONFIGS.SUPPLIERS.key],
    async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: CACHE_CONFIGS.SUPPLIERS.staleTime,
      gcTime: CACHE_CONFIGS.SUPPLIERS.gcTime,
    }
  );

  const searchSuppliers = (query: string) => {
    if (!query || !data) return [];
    
    const searchTerm = query.toLowerCase();
    return data
      .filter(supplier => 
        supplier.name?.toLowerCase().includes(searchTerm) ||
        supplier.phone?.toLowerCase().includes(searchTerm) ||
        supplier.email?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10);
  };

  const getSupplierById = (id: string) => {
    if (!data) return null;
    return data.find(supplier => supplier.id === id) || null;
  };

  // Cache update helpers
  const updateSupplierInCache = (updatedSupplier: Supplier) => {
    if (data) {
      const updatedData = data.map(supplier => 
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      );
      updateCache(updatedData);
    }
  };

  const addSupplierToCache = (newSupplier: Supplier) => {
    if (data) {
      updateCache([...data, newSupplier]);
    }
  };

  return {
    suppliers: data || [],
    isLoading,
    error,
    searchSuppliers,
    getSupplierById,
    invalidateSuppliers: invalidateCache,
    updateSupplierInCache,
    addSupplierToCache,
  };
}
