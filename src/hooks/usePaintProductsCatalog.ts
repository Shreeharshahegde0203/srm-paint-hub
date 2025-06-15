
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PaintProduct {
  id: string;
  code: string;
  name: string;
  brand: string;
  type: string;
  default_price: number;
  description?: string;
  color?: string;
  created_at?: string;
}

export function usePaintProductsCatalog() {
  const queryClient = useQueryClient();

  // Fetch catalog
  const query = useQuery({
    queryKey: ["paint_products_catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paint_products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaintProduct[];
    },
  });

  // Add new product
  const addMutation = useMutation({
    mutationFn: async (newProduct: Omit<PaintProduct, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("paint_products")
        .insert(newProduct)
        .select("*")
        .single();
      if (error) throw error;
      return data as PaintProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paint_products_catalog"] });
    },
  });

  // Update product
  const updateMutation = useMutation({
    mutationFn: async (input: { code: string; update: Partial<PaintProduct> }) => {
      const { code, update } = input;
      const { data, error } = await supabase
        .from("paint_products")
        .update(update)
        .eq("code", code)
        .select("*")
        .single();
      if (error) throw error;
      return data as PaintProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paint_products_catalog"] });
    },
  });

  return {
    catalog: query.data,
    isLoading: query.isLoading,
    error: query.error,
    addProduct: addMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
  };
}
