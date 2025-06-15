
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Supabase types
type Customer = Tables<"customers">;
type Invoice = Tables<"invoices">;

type CustomerReceivable = {
  customer: Customer;
  totalReceivable: number;
  invoiceCount: number;
};

const TradeReceivablesDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receivables, setReceivables] = useState<CustomerReceivable[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch trade receivables when opened
  const fetchReceivables = async () => {
    setLoading(true);
    setError(null);

    // Fetch unpaid invoices
    const { data: invoices, error: invErr } = await supabase
      .from("invoices")
      .select("*")
      .in("status", ["pending", "overdue"]);

    if (invErr) {
      setError("Failed to load trade receivables: " + invErr.message);
      setLoading(false);
      return;
    }

    if (!invoices || invoices.length === 0) {
      setReceivables([]);
      setLoading(false);
      return;
    }

    // Collect unique customer IDs
    const customerIds = Array.from(new Set(invoices.map((inv) => inv.customer_id).filter(Boolean)));

    // Fetch customer details
    let customers: Customer[] = [];
    if (customerIds.length > 0) {
      const { data: custs, error: custErr } = await supabase
        .from("customers")
        .select("*")
        .in("id", customerIds);
      if (custErr) {
        setError("Failed to fetch customers: " + custErr.message);
        setLoading(false);
        return;
      }
      customers = custs ?? [];
    }

    // Group invoices by customer, sum unpaid totals
    const receivableMap: { [cid: string]: CustomerReceivable } = {};
    for (const invoice of invoices) {
      const cid = invoice.customer_id;
      if (!cid) continue;
      if (!receivableMap[cid]) {
        const customer = customers.find((c) => c.id === cid);
        if (!customer) continue;
        receivableMap[cid] = {
          customer,
          totalReceivable: 0,
          invoiceCount: 0,
        };
      }
      receivableMap[cid].totalReceivable += Number(invoice.total);
      receivableMap[cid].invoiceCount += 1;
    }
    setReceivables(Object.values(receivableMap));
    setLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) fetchReceivables();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Trade Receivables
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Trade Receivables</DialogTitle>
          <DialogDescription>
            List of all customers with unpaid invoices.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center py-8 justify-center"><Loader2 className="animate-spin mr-2" />Loading…</div>
        ) : error ? (
          <div className="text-red-600 py-4">{error}</div>
        ) : receivables.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No outstanding receivables. All invoices are paid!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded bg-white dark:bg-slate-900">
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="px-4 py-2 text-left">Customer Name</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Pending Invoices</th>
                  <th className="px-4 py-2 text-left">Total Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {receivables.map(({ customer, totalReceivable, invoiceCount }) => (
                  <tr key={customer.id} className="border-b dark:border-slate-800">
                    <td className="px-4 py-2 font-semibold">{customer.name}</td>
                    <td className="px-4 py-2">{customer.phone ?? "—"}</td>
                    <td className="px-4 py-2">{customer.email ?? "—"}</td>
                    <td className="px-4 py-2">{invoiceCount}</td>
                    <td className="px-4 py-2 font-bold text-red-600">₹{totalReceivable.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default TradeReceivablesDialog;
