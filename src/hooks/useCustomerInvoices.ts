
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export function useCustomerInvoices() {
  const queryClient = useQueryClient();

  // Fetch invoices for a specific customer
  const getCustomerInvoices = (customerId: string) => {
    return useQuery({
      queryKey: ["customer_invoices", customerId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("regular_customer_invoices")
          .select(`
            *,
            invoice:invoice_id(*),
            project:project_id(project_name)
          `)
          .eq("regular_customer_id", customerId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      },
      enabled: !!customerId,
    });
  };

  // Link customer to invoice
  const linkCustomerInvoice = useMutation({
    mutationFn: async (data: TablesInsert<"regular_customer_invoices">) => {
      const { data: result, error } = await supabase
        .from("regular_customer_invoices")
        .insert(data)
        .select("*")
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer_invoices", data.regular_customer_id] });
    },
  });

  return {
    getCustomerInvoices,
    linkCustomerInvoice: linkCustomerInvoice.mutateAsync,
  };
}
