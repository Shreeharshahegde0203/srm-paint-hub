
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export function useCustomerPayments() {
  const queryClient = useQueryClient();

  // Fetch payments for a specific customer
  const getCustomerPayments = (customerId: string) => {
    return useQuery({
      queryKey: ["customer_payments", customerId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("regular_customer_payments")
          .select("*, invoice:invoice_id(*)")
          .eq("regular_customer_id", customerId)
          .order("payment_date", { ascending: false });
        if (error) throw error;
        return data;
      },
      enabled: !!customerId,
    });
  };

  // Add new payment
  const addPayment = useMutation({
    mutationFn: async (payment: TablesInsert<"regular_customer_payments">) => {
      const { data, error } = await supabase
        .from("regular_customer_payments")
        .insert(payment)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer_payments", data.regular_customer_id] });
    },
  });

  // Calculate due amount for customer
  const getCustomerDueAmount = async (customerId: string) => {
    // Get all invoices for this customer
    const { data: invoices, error: invoicesError } = await supabase
      .from("regular_customer_invoices")
      .select("invoice:invoice_id(total)")
      .eq("regular_customer_id", customerId);
    
    if (invoicesError) throw invoicesError;

    // Get all payments for this customer
    const { data: payments, error: paymentsError } = await supabase
      .from("regular_customer_payments")
      .select("paid_amount")
      .eq("regular_customer_id", customerId);
    
    if (paymentsError) throw paymentsError;

    const totalInvoiced = invoices?.reduce((sum, inv) => sum + (inv.invoice?.total || 0), 0) || 0;
    const totalPaid = payments?.reduce((sum, payment) => sum + payment.paid_amount, 0) || 0;
    
    return totalInvoiced - totalPaid;
  };

  return {
    getCustomerPayments,
    addPayment: addPayment.mutateAsync,
    getCustomerDueAmount,
  };
}
