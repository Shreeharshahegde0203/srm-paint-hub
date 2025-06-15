
import React from "react";

export function CustomerSummary({
  customer,
  invoiceCount,
  totalSpent,
  dueAmount,
}: {
  customer: any;
  invoiceCount: number;
  totalSpent: number;
  dueAmount: number;
}) {
  return (
    <div className="mb-4 space-y-1">
      <div className="text-2xl font-bold">{customer.name}</div>
      <div className="text-sm text-gray-500 dark:text-gray-300">
        {customer.phone || "—"} {customer.email && `• ${customer.email}`}
      </div>
      <div className="flex gap-4 mt-2 text-sm">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800/30 rounded">Total Invoices: {invoiceCount}</span>
        <span className="px-2 py-1 bg-green-100 dark:bg-green-800/30 rounded">Total Spent: ₹{totalSpent.toLocaleString()}</span>
        <span className="px-2 py-1 bg-red-100 dark:bg-red-800/30 rounded">Due: ₹{dueAmount.toLocaleString()}</span>
      </div>
    </div>
  );
}
