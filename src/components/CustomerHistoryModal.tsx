
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function CustomerHistoryModal({ customerId, onClose }: { customerId: string | null, onClose: () => void }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    supabase
      .from("invoices")
      .select("*")
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .then(async ({ data }) => {
        setInvoices(data || []);
        setLoading(false);
      });
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Customer Purchase History</h2>
        <button className="absolute top-2 right-4 text-gray-600 dark:text-gray-400" onClick={onClose}>&#10005;</button>
        {loading ? (
          <div className="text-center p-12">Loading…</div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No purchases found</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2">Invoice ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-1">{inv.id}</td>
                  <td>{inv.created_at?.split("T")[0]}</td>
                  <td>{inv.status}</td>
                  <td>₹{typeof inv.total === "number" ? inv.total.toFixed(2) : inv.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
