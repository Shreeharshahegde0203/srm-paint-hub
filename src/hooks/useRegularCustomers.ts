
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useGlobalCache } from "./useGlobalCache";
import { CACHE_CONFIGS } from "@/services/cacheService";

export function useRegularCustomers() {
  const queryClient = useQueryClient();

  // Use enhanced caching for regular customers
  const { data: customers, isLoading, error, invalidateCache } = useGlobalCache<Tables<"regular_customers">[]>(
    ["regular_customers"],
    async () => {
      const { data, error } = await supabase
        .from("regular_customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    {
      staleTime: CACHE_CONFIGS.CUSTOMERS.staleTime,
      gcTime: CACHE_CONFIGS.CUSTOMERS.gcTime,
    }
  );

  // Cache for customer products with individual customer caching
  const getCustomerProducts = async (customerId: string) => {
    const { data, error } = await supabase
      .from("regular_customer_products")
      .select("*, product:product_id(*)")
      .eq("regular_customer_id", customerId);
    if (error) throw error;
    return data;
  };

  // Enhanced mutations with cache updates
  const addCustomer = useMutation({
    mutationFn: async (customer: TablesInsert<"regular_customers">) => {
      const { data, error } = await supabase
        .from("regular_customers")
        .insert(customer)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateCache();
      queryClient.invalidateQueries({ queryKey: ["regular_customers"] });
    }
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, customer }: { id: string; customer: TablesUpdate<"regular_customers"> }) => {
      const { data, error } = await supabase
        .from("regular_customers")
        .update(customer)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateCache();
      queryClient.invalidateQueries({ queryKey: ["regular_customers"] });
    }
  });

  const addProductMapping = useMutation({
    mutationFn: async ({ customerId, productId, rate }: { customerId: string; productId: string; rate: number }) => {
      const { data, error } = await supabase
        .from("regular_customer_products")
        .upsert({
          regular_customer_id: customerId,
          product_id: productId,
          rate
        })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["regular_customer_products", vars.customerId] });
      // Also invalidate products cache since rates might affect pricing
      queryClient.invalidateQueries({ queryKey: [CACHE_CONFIGS.PRODUCTS.key] });
    }
  });

  const deleteProductMapping = useMutation({
    mutationFn: async ({ customerId, productId }: { customerId: string; productId: string }) => {
      const { error } = await supabase
        .from("regular_customer_products")
        .delete()
        .eq("regular_customer_id", customerId)
        .eq("product_id", productId);
      if (error) throw error;
      return true;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["regular_customer_products", vars.customerId] });
    }
  });

  // Search functionality using cached data
  const searchCustomers = (query: string) => {
    if (!query || !customers) return customers || [];
    
    const searchTerm = query.toLowerCase();
    return customers.filter(customer =>
      customer.name?.toLowerCase().includes(searchTerm) ||
      customer.phone?.toLowerCase().includes(searchTerm) ||
      customer.address?.toLowerCase().includes(searchTerm)
    );
  };

  return {
    customers: customers || [],
    customersLoading: isLoading,
    customersError: error,
    addCustomer: addCustomer.mutateAsync,
    updateCustomer: updateCustomer.mutateAsync,
    getCustomerProducts,
    addProductMapping: addProductMapping.mutateAsync,
    deleteProductMapping: deleteProductMapping.mutateAsync,
    searchCustomers,
    invalidateCustomers: invalidateCache,
  };
}
