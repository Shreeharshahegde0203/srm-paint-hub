
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Download, Eye, EyeOff } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Invoice } from "../hooks/useSupabaseInvoices";

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onDownloadPDF: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
}

export const InvoiceHistoryTable = ({ 
  invoices, 
  onEdit, 
  onDelete, 
  onDownloadPDF, 
  onView 
}: InvoiceHistoryTableProps) => {
  const [hiddenAmounts, setHiddenAmounts] = useState<Set<string>>(new Set());

  const toggleAmountVisibility = (invoiceId: string) => {
    const newHidden = new Set(hiddenAmounts);
    if (newHidden.has(invoiceId)) {
      newHidden.delete(invoiceId);
    } else {
      newHidden.add(invoiceId);
    }
    setHiddenAmounts(newHidden);
  };

  const handleStatusChange = async (invoice: Invoice) => {
    const newStatus = invoice.status === 'paid' ? 'pending' : 'paid';
    
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invoice status changed to ${newStatus}`,
      });

      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'overdue':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Invoice History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50 dark:bg-gray-800">
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Invoice ID</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Total</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr 
                  key={invoice.id} 
                  className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <td className="p-4">
                    <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {invoice.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {hiddenAmounts.has(invoice.id) ? (
                        <span className="text-gray-400 font-medium">****</span>
                      ) : (
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ₹{invoice.total.toLocaleString()}
                        </span>
                      )}
                      <button
                        onClick={() => toggleAmountVisibility(invoice.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={hiddenAmounts.has(invoice.id) ? "Show amount" : "Hide amount"}
                      >
                        {hiddenAmounts.has(invoice.id) ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleStatusChange(invoice)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-sm rounded-full font-medium">
                      {invoice.bill_type || 'GST'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(invoice)}
                        title="View"
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(invoice)}
                        title="Edit"
                        className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                      >
                        <Edit className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadPDF(invoice)}
                        title="Download PDF"
                        className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900"
                      >
                        <Download className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(invoice)}
                        title="Delete"
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {invoices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No invoices found
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Create your first invoice to get started
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
