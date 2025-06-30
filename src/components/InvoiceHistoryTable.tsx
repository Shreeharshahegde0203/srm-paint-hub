
import React, { useState } from "react";
import { Eye, Download, Edit, Trash2 } from "lucide-react";
import { Invoice } from "@/hooks/useSupabaseInvoices";

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onDownloadPDF: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
}

export const InvoiceHistoryTable: React.FC<InvoiceHistoryTableProps> = ({
  invoices,
  onEdit,
  onDelete,
  onDownloadPDF,
  onView,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(invoice => {
    const customer = invoice.customer;
    return (
      customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice History</h2>
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Invoice No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {invoice.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {invoice.customer?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(invoice.created_at || "").toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                    ₹{Number(invoice.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : invoice.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(invoice)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDownloadPDF(invoice)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(invoice)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(invoice)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
};
