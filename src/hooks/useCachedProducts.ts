
import { supabase } from "@/integrations/supabase/client";
import { useGlobalCache } from "./useGlobalCache";
import { CACHE_CONFIGS } from "@/services/cacheService";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export function useCachedProducts() {
  const { data, isLoading, error, invalidateCache, updateCache } = useGlobalCache<Product[]>(
    [CACHE_CONFIGS.PRODUCTS.key],
    async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: CACHE_CONFIGS.PRODUCTS.staleTime,
      gcTime: CACHE_CONFIGS.PRODUCTS.gcTime,
    }
  );

  const searchProducts = (query: string) => {
    if (!query || !data) return [];
    
    const searchTerm = query.toLowerCase();
    return data
      .filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm) ||
        product.type?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 20); // Limit results
  };

  const getProductByName = (name: string) => {
    if (!data) return null;
    return data.find(product => product.name === name) || null;
  };

  const getProductsByBrand = (brand: string) => {
    if (!data) return [];
    return data.filter(product => product.brand?.toLowerCase() === brand.toLowerCase());
  };

  // Helper to update product in cache after mutation
  const updateProductInCache = (updatedProduct: Product) => {
    if (data) {
      const updatedData = data.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      );
      updateCache(updatedData);
    }
  };

  // Helper to add product to cache after creation
  const addProductToCache = (newProduct: Product) => {
    if (data) {
      updateCache([...data, newProduct]);
    }
  };

  return {
    products: data || [],
    isLoading,
    error,
    searchProducts,
    getProductByName,
    getProductsByBrand,
    invalidateProducts: invalidateCache,
    updateProductInCache,
    addProductToCache,
  };
}
