
import React from "react";
import { Edit, Printer, Eye } from "lucide-react";

export function InvoiceHistorySection({
  invoices,
  onEdit,
  onView,
  onPrint,
}: {
  invoices: any[];
  onEdit: (invoice: any) => void;
  onView: (invoice: any) => void;
  onPrint: (invoice: any) => void;
}) {
  return (
    <div className="mt-4">
      <details open>
        <summary className="font-semibold cursor-pointer mb-2 text-lg flex items-center">
          Invoice History
        </summary>
        <div className="overflow-auto">
          <table className="w-full text-sm text-left mb-2">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300">
                <th>Invoice ID</th>
                <th>Date</th>
                <th>Project</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b dark:border-gray-700">
                  <td>{inv.invoice?.id?.slice(0, 8) ?? inv.id?.slice(0, 8)}</td>
                  <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td>
                    {inv.project?.project_name ? (
                      <span className="underline cursor-pointer text-blue-600 dark:text-blue-300">{inv.project.project_name}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>₹{(inv.invoice?.total ?? inv.total)?.toLocaleString?.() ?? "—"}</td>
                  <td>
                    <span className={
                      "px-2 py-1 rounded text-xs " +
                      (inv.invoice?.status === "paid"
                        ? "bg-green-200 text-green-800"
                        : inv.invoice?.status === "overdue"
                        ? "bg-red-200 text-red-800"
                        : "bg-orange-200 text-orange-800")
                    }>
                      {inv.invoice?.status ?? "—"}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button title="View" onClick={() => onView(inv)} className="hover:text-blue-600"><Eye className="h-4 w-4" /></button>
                    <button title="Edit" onClick={() => onEdit(inv)} className="hover:text-orange-600"><Edit className="h-4 w-4" /></button>
                    <button title="Print" onClick={() => onPrint(inv)} className="hover:text-gray-800"><Printer className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
