  import React, { useMemo, useState } from 'react';
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Edit, Trash2, Download, Eye, EyeOff, Search, CheckSquare, Square, X, MousePointerSquare } from 'lucide-react';
  import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
  import { supabase } from "@/integrations/supabase/client";
  import { toast } from "@/hooks/use-toast";
  import { Invoice } from "../hooks/useSupabaseInvoices";

  interface InvoiceHistoryTableProps {
    invoices: Invoice[];
    onEdit: (invoice: Invoice) => void;
    onDelete: (invoice: Invoice) => void;
    onDownloadPDF: (invoice: Invoice) => void;
    onView: (invoice: Invoice) => void;
    onBulkDelete?: (ids: string[]) => void;
  }

  export const InvoiceHistoryTable = ({ 
    invoices, 
    onEdit, 
    onDelete, 
    onDownloadPDF, 
    onView,
    onBulkDelete
  }: InvoiceHistoryTableProps) => {
    // Load hidden amounts from localStorage on component mount
    const [hiddenAmounts, setHiddenAmounts] = useState<Set<string>>(() => {
      const saved = localStorage.getItem('hiddenInvoiceAmounts');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const allFilteredSelected = useMemo(() => filteredInvoices.length > 0 && filteredInvoices.every(inv => selectedIds.has(inv.id)), [selectedIds, filteredInvoices]);

    const toggleRowSelection = (id: string) => {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
    };
    const clearSelection = () => setSelectedIds(new Set());
    const selectAllFiltered = () => setSelectedIds(new Set(filteredInvoices.map(inv => inv.id)));

    const toggleAmountVisibility = (invoiceId: string) => {
      const newHidden = new Set(hiddenAmounts);
      if (newHidden.has(invoiceId)) {
        newHidden.delete(invoiceId);
      } else {
        newHidden.add(invoiceId);
      }
      setHiddenAmounts(newHidden);
      // Save to localStorage
      localStorage.setItem('hiddenInvoiceAmounts', JSON.stringify(Array.from(newHidden)));
    };

    const handleStatusChange = async (invoice: Invoice) => {
      let newStatus: string;
      let updates: any = {};
      
      if (invoice.status === 'paid') {
        newStatus = 'pending';
        updates.partial_amount_paid = 0;
      } else if (invoice.status === 'partially_paid') {
        newStatus = 'paid';
        updates.partial_amount_paid = invoice.total;
      } else {
        newStatus = 'paid';
        updates.partial_amount_paid = invoice.total;
      }
      
      updates.status = newStatus;
      
      try {
        const { error } = await supabase
          .from('invoices')
          .update(updates)
          .eq('id', invoice.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: `Invoice status changed to ${newStatus.replace('_', ' ')}`,
        });

        // Refresh the page without showing blank screen
        setTimeout(() => {
          window.location.reload();
        }, 500);
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
        case 'partially_paid':
          return 'bg-orange-500 text-white hover:bg-orange-600';
        case 'overdue':
          return 'bg-red-500 text-white hover:bg-red-600';
        default:
          return 'bg-yellow-500 text-white hover:bg-yellow-600';
      }
    };

    // Helper to get user-friendly status label
    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'partially_paid':
          return 'Partially Paid';
        case 'paid':
          return 'Paid';
        case 'pending':
          return 'Pending';
        case 'overdue':
          return 'Overdue';
        default:
          return status;
      }
    };

    // Filter invoices based on search term
    const filteredInvoices = invoices.filter(invoice => {
      const searchLower = searchTerm.toLowerCase();
      const customerName = invoice.customer?.name?.toLowerCase() || '';
      const invoiceId = invoice.id.toLowerCase();
      const invoiceDate = invoice.created_at ? new Date(invoice.created_at).toLocaleDateString().toLowerCase() : '';
      
      return customerName.includes(searchLower) || 
            invoiceId.includes(searchLower) || 
            invoiceDate.includes(searchLower);
    });

    return (
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold">Invoice History</CardTitle>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md text-sm">
                <span className="font-semibold">{selectedIds.size} selected</span>
                <button
                  onClick={() => { if (onBulkDelete) onBulkDelete(Array.from(selectedIds)); clearSelection(); }}
                  className="flex items-center gap-1 text-red-100 hover:text-white"
                  title="Delete selected"
                >
                  <Trash2 className="h-4 w-4" /> Delete selected
                </button>
                <button onClick={clearSelection} className="text-gray-200 hover:text-white" title="Clear selection">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search by customer name, invoice ID, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                  <th className="p-4">
                    <button
                      onClick={() => (allFilteredSelected ? clearSelection() : selectAllFiltered())}
                      className="text-gray-700 dark:text-gray-200"
                      title={allFilteredSelected ? 'Clear selection' : 'Select all'}
                    >
                      {allFilteredSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                    </button>
                  </th>
                  <th className="text-left p-4 font-bold text-gray-800 dark:text-gray-200">Invoice ID</th>
                  <th className="text-left p-4 font-bold text-gray-800 dark:text-gray-200">Customer</th>
                  <th className="text-left p-4 font-bold text-gray-800 dark:text-gray-200">Date</th>
                  <th className="text-left p-4 font-bold text-gray-800 dark:text-gray-200">Total</th>
                  <th className="text-left p-4 font-bold text-gray-800 dark:text-gray-200">Status</th>
                  <th className="text-left p-4 font-bold text-gray-800 dark:text-gray-200">Type</th>
                  <th className="text-left p-4 font-bold text-gray-800 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 cursor-pointer ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'
                    }`}
                    onDoubleClick={() => onEdit(invoice)}
                  >
                    <td className="p-4">
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleRowSelection(invoice.id); }}
                            className={`rounded border px-2 py-1 ${selectedIds.has(invoice.id) ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200'}`}
                            title={selectedIds.has(invoice.id) ? 'Deselect' : 'Select'}
                          >
                            {selectedIds.has(invoice.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                          </button>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem onClick={() => toggleRowSelection(invoice.id)}>
                            {selectedIds.has(invoice.id) ? 'Deselect this' : 'Select this'}
                          </ContextMenuItem>
                          <ContextMenuItem onClick={selectAllFiltered}>Select all</ContextMenuItem>
                          <ContextMenuItem onClick={clearSelection}>Clear selection</ContextMenuItem>
                          {selectedIds.size > 0 && (
                            <ContextMenuItem onClick={() => { if (onBulkDelete) onBulkDelete(Array.from(selectedIds)); clearSelection(); }} className="text-red-600">
                              Delete selected
                            </ContextMenuItem>
                          )}
                        </ContextMenuContent>
                      </ContextMenu>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 px-3 py-1 rounded-full text-blue-800 dark:text-blue-200">
                        #{invoice.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {invoice.customer?.name || 'Unknown Customer'}
                      </div>
                      {invoice.customer?.phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {invoice.customer.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {hiddenAmounts.has(invoice.id) ? (
                          <span className="text-gray-400 font-medium">****</span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              ₹{invoice.total.toLocaleString('en-IN')}
                            </span>
                            {invoice.status === 'partially_paid' && (invoice as any).partial_amount_paid && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <div>Paid: ₹{((invoice as any).partial_amount_paid || 0).toLocaleString('en-IN')}</div>
                                <div className="text-red-500 font-medium">
                                  Due: ₹{(invoice.total - ((invoice as any).partial_amount_paid || 0)).toLocaleString('en-IN')}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          onClick={() => toggleAmountVisibility(invoice.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
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
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${getStatusColor(invoice.status)}`}
                      >
                        {getStatusLabel(invoice.status)}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 dark:from-indigo-900 dark:to-blue-900 dark:text-indigo-200 text-sm rounded-full font-semibold">
                        {invoice.bill_type || 'GST'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(invoice)}
                          title="Edit"
                          className="h-9 w-9 p-0 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200 hover:scale-110"
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadPDF(invoice)}
                          title="Download PDF"
                          className="h-9 w-9 p-0 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all duration-200 hover:scale-110"
                        >
                          <Download className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(invoice)}
                          title="Delete"
                          className="h-9 w-9 p-0 hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredInvoices.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-500 dark:text-gray-400 text-xl font-semibold">
                  {searchTerm ? 'No invoices found matching your search' : 'No invoices found'}
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first invoice to get started'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
