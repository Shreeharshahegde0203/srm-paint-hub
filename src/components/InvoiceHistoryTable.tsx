
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Download, Eye, EyeOff } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Invoice {
  id: string;
  total: number;
  status: string;
  created_at: string;
  customer_id: string;
  bill_type?: string;
  billing_mode?: string;
}

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

      // Refresh the page or update local state
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
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Invoice ID</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 font-mono text-xs">
                    {invoice.id.slice(0, 8)}
                  </td>
                  <td className="p-3">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {hiddenAmounts.has(invoice.id) ? (
                        <span className="text-gray-400">****</span>
                      ) : (
                        <span>₹{invoice.total.toLocaleString()}</span>
                      )}
                      <button
                        onClick={() => toggleAmountVisibility(invoice.id)}
                        className="text-gray-400 hover:text-gray-600"
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
                  <td className="p-3">
                    <button
                      onClick={() => handleStatusChange(invoice)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </button>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {invoice.bill_type || 'GST'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(invoice)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(invoice)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadPDF(invoice)}
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(invoice)}
                        title="Delete"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {invoices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No invoices found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
