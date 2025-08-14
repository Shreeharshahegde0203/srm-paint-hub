import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileSpreadsheet, Calendar, DollarSign, ArrowUpDown } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BillData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  productName: string;
  base: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  cgstPercent: number;
  sgstPercent: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmount: number;
  status: string;
}

interface InvoiceSummary {
  invoiceNumber: string;
  date: string;
  customerName: string;
  hsnCode: string;
  cgstTotal: number;
  sgstTotal: number;
  invoiceTotal: number;
}

export const BillHistoryCSV = () => {
  const [billData, setBillData] = useState<BillData[]>([]);
  const [summaryData, setSummaryData] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'hsn'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchBillData = async () => {
    setLoading(true);
    try {
      // Fetch invoices with customer and item details
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          id,
          created_at,
          total,
          status,
          customer:customers!invoices_customer_id_fkey(name),
          invoice_items(
            quantity,
            price,
            gst_percentage,
            price_excluding_gst,
            color_code,
            base,
            unit_type,
            product:products!invoice_items_product_id_fkey(
              name,
              hsn_code,
              gst_rate
            )
          )
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (invoiceError) throw invoiceError;

      const processedBillData: BillData[] = [];
      const processedSummaryData: InvoiceSummary[] = [];

      invoices?.forEach((invoice) => {
        const invoiceNumber = `INV-${invoice.id.slice(0, 8)}`;
        const date = invoice.created_at ? new Date(invoice.created_at).toISOString().slice(0, 10) : '';
        const customerName = invoice.customer?.name || 'Unknown Customer';

        let invoiceCGSTTotal = 0;
        let invoiceSGSTTotal = 0;

        invoice.invoice_items?.forEach((item) => {
          const gstRate = item.gst_percentage || item.product?.gst_rate || 18;
          const baseAmount = item.price_excluding_gst || (item.price / (1 + gstRate / 100));
          const cgstAmount = (baseAmount * gstRate) / 200; // Half of GST for CGST
          const sgstAmount = (baseAmount * gstRate) / 200; // Half of GST for SGST

          invoiceCGSTTotal += cgstAmount;
          invoiceSGSTTotal += sgstAmount;

          processedBillData.push({
            invoiceNumber,
            date,
            customerName,
            productName: item.product?.name || 'Unknown Product',
            base: item.base || '',
            hsnCode: item.product?.hsn_code || '',
            quantity: item.quantity,
            unit: item.unit_type || 'Piece',
            rate: item.price,
            amount: baseAmount,
            cgstPercent: gstRate / 2,
            sgstPercent: gstRate / 2,
            cgstAmount,
            sgstAmount,
            totalAmount: item.price * item.quantity,
            status: invoice.status
          });
        });

        // Get unique HSN codes for this invoice
        const hsnCodes = invoice.invoice_items?.map(item => item.product?.hsn_code || '').filter(Boolean);
        const uniqueHsnCode = [...new Set(hsnCodes)].join(', ') || '';

        processedSummaryData.push({
          invoiceNumber,
          date,
          customerName,
          hsnCode: uniqueHsnCode,
          cgstTotal: invoiceCGSTTotal,
          sgstTotal: invoiceSGSTTotal,
          invoiceTotal: invoice.total
        });
      });

      setBillData(processedBillData);
      setSummaryData(processedSummaryData);
    } catch (error) {
      console.error('Error fetching bill data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bill data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillData();
    
    // Set up real-time subscription for invoice updates
    const channel = supabase
      .channel('bill-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        () => {
          fetchBillData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoice_items'
        },
        () => {
          fetchBillData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sortData = (data: BillData[]) => {
    return [...data].sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'amount':
          aVal = a.totalAmount;
          bVal = b.totalAmount;
          break;
        case 'hsn':
          aVal = a.hsnCode;
          bVal = b.hsnCode;
          break;
        default:
          return 0;
      }
      
      if (sortBy === 'hsn') {
        // String comparison for HSN codes
        if (sortOrder === 'asc') {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      } else {
        // Numeric/Date comparison
        if (sortOrder === 'asc') {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      }
    });
  };

  const sortSummaryData = (data: InvoiceSummary[]) => {
    return [...data].sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'amount':
          aVal = a.invoiceTotal;
          bVal = b.invoiceTotal;
          break;
        case 'hsn':
          aVal = a.hsnCode;
          bVal = b.hsnCode;
          break;
        default:
          return 0;
      }
      
      if (sortBy === 'hsn') {
        if (sortOrder === 'asc') {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      } else {
        if (sortOrder === 'asc') {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      }
    });
  };

  const exportToCSV = (filterType: 'all' | 'paid' | 'unpaid' | 'gst' = 'all') => {
    let filteredBillData = billData;
    let filteredSummaryData = summaryData;
    
    if (filterType === 'paid') {
      filteredBillData = billData.filter(bill => bill.status === 'paid');
      filteredSummaryData = summaryData.filter(summary => 
        billData.some(bill => bill.invoiceNumber === summary.invoiceNumber && bill.status === 'paid')
      );
    } else if (filterType === 'unpaid') {
      filteredBillData = billData.filter(bill => bill.status === 'pending');
      filteredSummaryData = summaryData.filter(summary => 
        billData.some(bill => bill.invoiceNumber === summary.invoiceNumber && bill.status === 'pending')
      );
    } else if (filterType === 'gst') {
      // Filter only bills with GST (HSN code present and GST amount > 0)
      filteredBillData = billData.filter(bill => 
        bill.hsnCode && bill.hsnCode.trim() !== '' && (bill.cgstAmount > 0 || bill.sgstAmount > 0)
      );
      filteredSummaryData = summaryData.filter(summary => 
        summary.hsnCode && summary.hsnCode.trim() !== '' && (summary.cgstTotal > 0 || summary.sgstTotal > 0)
      );
    }

    // Apply sorting
    filteredBillData = sortData(filteredBillData);
    filteredSummaryData = sortSummaryData(filteredSummaryData);

    if (filteredBillData.length === 0) {
      toast({
        title: "No Data",
        description: `No ${filterType === 'all' ? '' : filterType === 'gst' ? 'GST ' : filterType} bill data available to export`,
        variant: "destructive",
      });
      return;
    }

    // Create detailed bill data CSV (with numeric values only)
    const detailedHeaders = [
      'Invoice No', 'Date', 'Customer Name', 'Product Name', 'Base/Specification',
      'HSN Code', 'Quantity', 'Unit', 'Rate', 'Amount', 'CGST%', 'SGST%',
      'CGST Amount', 'SGST Amount', 'Total Amount', 'Status'
    ];

    const detailedRows = filteredBillData.map(bill => [
      bill.invoiceNumber,
      bill.date,
      bill.customerName,
      bill.productName,
      bill.base,
      bill.hsnCode,
      bill.quantity,
      bill.unit,
      bill.rate.toFixed(2),
      bill.amount.toFixed(2),
      bill.cgstPercent,
      bill.sgstPercent,
      bill.cgstAmount.toFixed(2),
      bill.sgstAmount.toFixed(2),
      bill.totalAmount.toFixed(2),
      bill.status
    ]);

    // Create summary CSV (with numeric values only)
    const summaryHeaders = ['Invoice No', 'Date', 'Customer', 'HSN Code', 'CGST Total', 'SGST Total', 'Invoice Total'];
    const summaryRows = filteredSummaryData.map(summary => [
      summary.invoiceNumber,
      summary.date,
      summary.customerName,
      summary.hsnCode,
      summary.cgstTotal.toFixed(2),
      summary.sgstTotal.toFixed(2),
      summary.invoiceTotal.toFixed(2)
    ]);

    // Create combined CSV content
    const csvContent = [
      `=== ${filterType.toUpperCase()} BILL DATA ===`,
      detailedHeaders.join(','),
      ...detailedRows.map(row => row.map(cell => `"${cell}"`).join(',')),
      '',
      `=== ${filterType.toUpperCase()} INVOICE SUMMARY ===`,
      summaryHeaders.join(','),
      ...summaryRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bill-history-${filterType}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${filterType === 'all' ? 'All' : filterType === 'paid' ? 'Paid' : filterType === 'unpaid' ? 'Unpaid' : 'GST'} bill history has been exported to CSV`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bill History Export
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bills</p>
                <p className="font-semibold">{billData.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="font-semibold">
                  ₹{summaryData.reduce((sum, item) => sum + item.invoiceTotal, 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <FileSpreadsheet className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ready to Export</p>
                <p className="font-semibold">CSV Format</p>
              </div>
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Arrange By:</span>
            </div>
            <Select value={sortBy} onValueChange={(value: 'date' | 'amount' | 'hsn') => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Bill Amount</SelectItem>
                <SelectItem value="hsn">HSN Code</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => exportToCSV('all')} 
              disabled={loading || billData.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export All Bills CSV
            </Button>
            <Button 
              onClick={() => exportToCSV('paid')} 
              disabled={loading || billData.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Paid Bills CSV
            </Button>
            <Button 
              onClick={() => exportToCSV('unpaid')} 
              disabled={loading || billData.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Unpaid Bills CSV
            </Button>
            <Button 
              onClick={() => exportToCSV('gst')} 
              disabled={loading || billData.length === 0}
              variant="outline"
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Download className="h-4 w-4" />
              Export GST Bills CSV
            </Button>
            <Button 
              onClick={fetchBillData} 
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">Loading bill data...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
