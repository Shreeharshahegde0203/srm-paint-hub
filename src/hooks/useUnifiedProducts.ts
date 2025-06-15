
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export interface UnifiedProduct {
  id: string;
  code: string;
  name: string;
  brand: string;
  type: string;
  color: string;
  price: number;
  stock: number;
  source: 'inventory' | 'catalog';
  gstRate?: number;
  unit?: string;
  description?: string;
  cost_price?: number;
  supplier_id?: string;
  default_price?: number;
}

export function useUnifiedProducts() {
  const queryClient = useQueryClient();

  // Fetch unified products using SQL JOIN
  const productsQuery = useQuery({
    queryKey: ["unified_products"],
    queryFn: async () => {
      // Get inventory products
      const { data: inventoryProducts, error: invError } = await supabase
        .from("products")
        .select("*");
      
      if (invError) throw invError;

      // Get catalog products
      const { data: catalogProducts, error: catError } = await supabase
        .from("paint_products")
        .select("*");
      
      if (catError) throw catError;

      // Combine and normalize both product types
      const unified: UnifiedProduct[] = [];

      // Add inventory products
      if (inventoryProducts) {
        inventoryProducts.forEach(product => {
          unified.push({
            id: product.id,
            code: product.code,
            name: product.name,
            brand: product.brand,
            type: product.type,
            color: product.color,
            price: product.price,
            stock: product.stock,
            source: 'inventory',
            gstRate: product.gst_rate,
            unit: product.unit,
            description: product.description || undefined,
            cost_price: product.cost_price || undefined,
            supplier_id: product.supplier_id || undefined,
          });
        });
      }

      // Add catalog products (if not already in inventory)
      if (catalogProducts) {
        catalogProducts.forEach(product => {
          // Check if this product code already exists in inventory
          const existsInInventory = unified.some(p => p.code === product.code);
          
          if (!existsInInventory) {
            unified.push({
              id: product.id,
              code: product.code,
              name: product.name,
              brand: product.brand,
              type: product.type,
              color: product.color || '',
              price: product.default_price,
              stock: 0, // Catalog products have no stock
              source: 'catalog',
              description: product.description || undefined,
              default_price: product.default_price,
            });
          }
        });
      }

      return unified.sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  // Search products across both sources
  const searchProducts = (query: string) => {
    if (!query || !productsQuery.data) return [];
    
    const searchTerm = query.toLowerCase();
    return productsQuery.data
      .filter(product => 
        product.code?.toLowerCase().includes(searchTerm) ||
        product.name?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm) ||
        product.type?.toLowerCase().includes(searchTerm)
      )
      .slice(0, 20);
  };

  const getProductByCode = (code: string) => {
    if (!productsQuery.data) return null;
    return productsQuery.data.find(product => product.code === code) || null;
  };

  const getProductsByBrand = (brand: string) => {
    if (!productsQuery.data) return [];
    return productsQuery.data.filter(product => 
      product.brand?.toLowerCase() === brand.toLowerCase()
    );
  };

  // Add product to inventory (creates actual stock)
  const addToInventoryMutation = useMutation({
    mutationFn: async (product: TablesInsert<"products">) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unified_products"] });
    }
  });

  // Add product to catalog (for billing reference)
  const addToCatalogMutation = useMutation({
    mutationFn: async (product: TablesInsert<"paint_products">) => {
      const { data, error } = await supabase
        .from("paint_products")
        .insert(product)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unified_products"] });
    }
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    searchProducts,
    getProductByCode,
    getProductsByBrand,
    addToInventory: addToInventoryMutation.mutateAsync,
    addToCatalog: addToCatalogMutation.mutateAsync,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["unified_products"] }),
  };
}
