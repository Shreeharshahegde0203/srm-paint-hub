
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

// --- Types ---
export type Product = Tables<"products">;
export type Customer = Tables<"customers">;
export type Invoice = Tables<"invoices"> & {
  customer: Customer | null;
  items?: InvoiceItem[];
};
export type InvoiceItem = Tables<"invoice_items"> & {
  product?: Product;
};

// --- Hook ---
export function useSupabaseInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch invoices + details (excluding deleted)
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: invoiceRows, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (invoiceError) {
      setError(invoiceError.message);
      setLoading(false);
      return;
    }
    const { data: customers } = await supabase.from("customers").select("*");
    const { data: invoiceItems } = await supabase.from("invoice_items").select("*");
    const invoicesEnriched: Invoice[] = (invoiceRows ?? []).map((inv) => ({
      ...inv,
      customer: customers?.find((c) => c.id === inv.customer_id) ?? null,
      items: (invoiceItems ?? []).filter((item) => item.invoice_id === inv.id),
    }));
    setInvoices(invoicesEnriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchInvoices();
    const channel = supabase.channel("schema-db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices" }, fetchInvoices)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchInvoices]);

  // Edit invoice (only updates invoice and its items, not customer)
  const editInvoice = async (id: string, { items, status, discount, total, partialAmount, bill_type, billing_mode }: { items: any[]; status: string; discount: number; total: number; partialAmount?: number; bill_type?: string; billing_mode?: string; }) => {
    // Update invoice fields
    const updates: any = { status, total, discount };
    if (bill_type) updates.bill_type = bill_type;
    if (billing_mode) updates.billing_mode = billing_mode;
    if (status === 'partially_paid' && partialAmount !== undefined) {
      updates.partial_amount_paid = partialAmount;
    } else if (status === 'paid') {
      updates.partial_amount_paid = total; // Full amount when marked as paid
    } else {
      updates.partial_amount_paid = 0; // Reset when pending
    }
    
    const { error: invErr } = await supabase
      .from("invoices").update(updates).eq("id", id);
    if (invErr) throw new Error(invErr.message);

    // Update/delete/add items: for simplicity, remove all and re-insert (best for UI/logic)
    await supabase.from("invoice_items").delete().eq("invoice_id", id);
    for (let item of items) {
      if (!item.isReturned) {
        await supabase.from("invoice_items").insert({
          invoice_id: id,
          product_id: item.product.id,
          price: item.unitPrice,
          quantity: item.quantity,
          color_code: item.colorCode || null,
          base: item.base || null,
          unit_type: item.unitType || 'Piece',
          unit_quantity: (item.unitQuantity != null && !isNaN(item.unitQuantity)) ? item.unitQuantity : 1,
          gst_percentage: item.gstPercentage || 18,
          price_excluding_gst: item.priceExcludingGst || item.unitPrice
        });
      }
    }
    await fetchInvoices();
  };

  // Soft-delete invoice
  const deleteInvoice = async (id: string) => {
    const { error } = await supabase.from("invoices").update({ deleted_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Invoice deleted", description: "The invoice was deleted successfully." });
      await fetchInvoices();
    }
  };

  // Soft-delete multiple invoices at once
  const deleteInvoices = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const { error } = await supabase
      .from("invoices")
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Invoices deleted", description: `${ids.length} invoice(s) were deleted successfully.` });
      await fetchInvoices();
    }
  };

  // All other existing logic (status, create, etc) can be merged here
  return {
    invoices, loading, error, fetchInvoices, editInvoice, deleteInvoice, deleteInvoices
    // You may want to migrate: setInvoiceStatus, createInvoice, etc, here in your final refactor!
  };
}
