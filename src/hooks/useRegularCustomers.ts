
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export function useRegularCustomers() {
  const queryClient = useQueryClient();

  // 1. Fetch regular customers
  const customersQuery = useQuery({
    queryKey: ["regular_customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("regular_customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"regular_customers">[];
    }
  });

  // 2. Fetch product mappings per customer
  const getCustomerProducts = async (customerId: string) => {
    const { data, error } = await supabase
      .from("regular_customer_products")
      .select("*, product:product_id(*)")
      .eq("regular_customer_id", customerId);
    if (error) throw error;
    return data;
  }

  // 3. Mutations for add/edit customer
  const addCustomer = useMutation({
    mutationFn: async (customer: TablesInsert<"regular_customers">) => {
      const { data, error } = await supabase.from("regular_customers").insert(customer).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["regular_customers"] })
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, customer }: { id: string; customer: TablesUpdate<"regular_customers"> }) => {
      const { data, error } = await supabase.from("regular_customers").update(customer).eq("id", id).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["regular_customers"] })
  });

  // 4. Assign product to customer with rate
  const addProductMapping = useMutation({
    mutationFn: async ({ customerId, productId, rate }: { customerId: string; productId: string; rate: number }) => {
      const { data, error } = await supabase.from("regular_customer_products").upsert({
        regular_customer_id: customerId,
        product_id: productId,
        rate
      }).select("*").single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, vars) =>
      queryClient.invalidateQueries({ queryKey: ["regular_customer_products", vars.customerId] })
  });

  // 5. Remove mapping
  const deleteProductMapping = useMutation({
    mutationFn: async ({ customerId, productId }: { customerId: string; productId: string }) => {
      const { error } = await supabase.from("regular_customer_products")
        .delete()
        .eq("regular_customer_id", customerId)
        .eq("product_id", productId);
      if (error) throw error;
      return true;
    },
    onSuccess: (_data, vars) =>
      queryClient.invalidateQueries({ queryKey: ["regular_customer_products", vars.customerId] })
  });

  return {
    customers: customersQuery.data || [],
    customersLoading: customersQuery.isLoading,
    customersError: customersQuery.error,
    addCustomer: addCustomer.mutateAsync,
    updateCustomer: updateCustomer.mutateAsync,
    getCustomerProducts,
    addProductMapping: addProductMapping.mutateAsync,
    deleteProductMapping: deleteProductMapping.mutateAsync,
  };
}
