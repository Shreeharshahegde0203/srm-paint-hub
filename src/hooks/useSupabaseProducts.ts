
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate, Tables } from "@/integrations/supabase/types";

export function useSupabaseProducts() {
  const queryClient = useQueryClient();

  // 1. Fetch products
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data as Tables<"products">[];
    }
  });

  // 2. Add product
  const addMutation = useMutation({
    mutationFn: async (product: TablesInsert<"products">) => {
      console.log("Attempting to add product:", product);
      const { data, error } = await supabase.from("products").insert(product).select("*").single();
      if (error) {
        console.error("Supabase error inserting product:", error);
        throw error;
      }
      console.log("Product added successfully in DB:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      console.error("Error in addProduct mutation:", error.message);
    },
  });

  // 3. Update
  const updateMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string; product: TablesUpdate<"products"> }) => {
      console.log(`Attempting to update product ${id}:`, product);
      const { data, error } = await supabase.from("products").update(product).eq("id", id).select("*").single();
      if (error) {
        console.error(`Supabase error updating product ${id}:`, error);
        throw error;
      }
      console.log("Product updated successfully in DB:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      console.error("Error in updateProduct mutation:", error.message);
    }
  });

  // 4. Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  return {
    products: productsQuery.data,
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    addProduct: addMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync
  };
}
