import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const BillsPDFExporter = () => {
  const [loading, setLoading] = useState(false);

  const exportAllBillsPDF = async () => {
    setLoading(true);
    try {
      // Fetch all invoices with customer and item details
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          id,
          created_at,
          total,
          status,
          bill_type,
          customer:customers!invoices_customer_id_fkey(
            name,
            phone,
            address,
            email,
            gstin
          ),
          invoice_items(
            quantity,
            price,
            gst_percentage,
            price_excluding_gst,
            color_code,
            base,
            unit_type,
            unit_quantity,
            product:products!invoice_items_product_id_fkey(
              name,
              hsn_code,
              gst_rate,
              base
            )
          )
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (invoiceError) throw invoiceError;

      if (!invoices || invoices.length === 0) {
        toast({
          title: "No Data",
          description: "No bills found to export",
          variant: "destructive",
        });
        return;
      }

      // Create HTML content for all bills
      let allBillsHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>All Bills Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .page-break { page-break-after: always; }
            .bill-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
            .company-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .bill-title { font-size: 14px; font-weight: bold; margin: 10px 0; text-align: center; }
            .bill-details { margin: 10px 0; }
            .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .table th, .table td { border: 1px solid #000; padding: 4px; text-align: left; font-size: 10px; }
            .table th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .summary { margin-top: 15px; }
            .divider { border-top: 1px solid #000; margin: 10px 0; }
            @media print { 
              body { margin: 0; }
              .page-break { page-break-after: always; }
            }
          </style>
        </head>
        <body>
      `;

      invoices.forEach((invoice, index) => {
        const invoiceNumber = `INV-${invoice.id.slice(0, 8)}`;
        const date = new Date(invoice.created_at!).toLocaleDateString('en-IN');
        const customerName = invoice.customer?.name || 'Unknown Customer';
        
        // Calculate totals
        let subtotal = 0;
        let gstTotal = 0;
        
        invoice.invoice_items?.forEach((item) => {
          const itemTotal = item.quantity * item.price;
          subtotal += itemTotal;
          
          if (invoice.bill_type === 'gst') {
            const gstRate = item.gst_percentage || item.product?.gst_rate || 18;
            const baseAmount = item.price_excluding_gst || (item.price / (1 + gstRate / 100));
            gstTotal += (baseAmount * gstRate) / 100;
          }
        });

        allBillsHTML += `
          <div class="bill-header">
            <div class="company-name">SHREERAM MARKETING</div>
            <div>Shreeram Building, Nadigalli, SIRSI-581401 (U.K.)</div>
            <div>Phone: M: 9448376055</div>
          </div>

          <div class="bill-title">
            ${invoice.bill_type === 'casual' ? 'CASUAL BILL' : 
              invoice.bill_type === 'gst' ? 'TAX INVOICE' : 'NON-GST BILL'}
          </div>

          <div class="bill-details">
            <strong>Invoice No:</strong> ${invoiceNumber}<br>
            <strong>Date:</strong> ${date}<br>
            <strong>Customer:</strong> ${customerName}<br>
            <strong>Status:</strong> ${invoice.status.toUpperCase()}
            ${invoice.customer?.phone ? `<br><strong>Phone:</strong> ${invoice.customer.phone}` : ''}
            ${invoice.customer?.address ? `<br><strong>Address:</strong> ${invoice.customer.address}` : ''}
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Description</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.invoice_items?.map((item, itemIndex) => {
                const itemDescription = `${item.product?.name || 'Unknown Product'}${item.color_code ? ` - ${item.color_code}` : ''}`;
                const itemTotal = item.quantity * item.price;
                
                return `
                  <tr>
                    <td class="text-center">${itemIndex + 1}</td>
                    <td>${itemDescription}</td>
                    <td class="text-center">${item.product?.hsn_code || ''}</td>
                    <td class="text-center">${
  (item.unit_quantity && item.unit_type)
    ? `${item.unit_quantity} ${item.unit_type} x ${item.quantity}`
    : item.quantity
}</td>
                    <td class="text-right">₹${item.price.toFixed(2)}</td>
                    <td class="text-right">₹${itemTotal.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="summary">
            <div style="text-align: right;">
              <strong>Subtotal: ₹${subtotal.toFixed(2)}</strong><br>
              ${invoice.bill_type === 'gst' ? `<strong>GST: ₹${gstTotal.toFixed(2)}</strong><br>` : ''}
              <strong>Total: ₹${invoice.total.toFixed(2)}</strong>
            </div>
          </div>

          ${index < invoices.length - 1 ? '<div class="page-break"></div>' : ''}
        `;
      });

      allBillsHTML += `
        </body>
        </html>
      `;

      // Open print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        toast({
          title: "Error",
          description: "Please allow popups to export bills",
          variant: "destructive",
        });
        return;
      }

      printWindow.document.write(allBillsHTML);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 1000);

      toast({
        title: "Export Successful",
        description: `${invoices.length} bills exported to PDF`,
      });

    } catch (error) {
      console.error('Error exporting bills:', error);
      toast({
        title: "Error",
        description: "Failed to export bills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Bills PDF Export
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Export Format</p>
              <p className="font-semibold">PDF (Print Ready)</p>
            </div>
          </div>

          <Button 
            onClick={exportAllBillsPDF} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {loading ? 'Exporting...' : 'Export All Bills PDF'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
