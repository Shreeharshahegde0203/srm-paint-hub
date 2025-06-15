
interface InvoiceData {
  invoiceNumber: string;
  date: string;
  time: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    email?: string;
    gstin?: string;
  };
  items: Array<{
    product: {
      name: string;
      code: string;
      gstRate: number;
    };
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export const generateInvoicePDF = (invoice: InvoiceData) => {
  // Create a new window for the invoice
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Please allow popups to download the invoice');
    return;
  }

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
        .company-name { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 5px; }
        .company-details { font-size: 14px; color: #666; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .customer-info { margin-bottom: 20px; }
        .info-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f8f9fa; font-weight: bold; }
        .text-right { text-align: right; }
        .total-section { margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
        .final-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; }
        .gst-details { margin-top: 20px; font-size: 12px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SRM</div>
        <div class="company-name">SHREERAM MARKETING</div>
        <div class="company-details">
          Premium Paints & Coatings Dealer<br>
          Address: [Your Address Here]<br>
          Phone: [Your Phone] | Email: [Your Email]<br>
          GSTIN: [Your GSTIN Number]
        </div>
      </div>

      <div class="invoice-info">
        <div class="info-box" style="width: 45%;">
          <h3>Invoice Details</h3>
          <strong>Invoice No:</strong> ${invoice.invoiceNumber}<br>
          <strong>Date:</strong> ${invoice.date}<br>
          <strong>Time:</strong> ${invoice.time}
        </div>
        <div class="info-box" style="width: 45%;">
          <h3>Bill To</h3>
          <strong>${invoice.customer.name}</strong><br>
          Phone: ${invoice.customer.phone}<br>
          ${invoice.customer.email ? `Email: ${invoice.customer.email}<br>` : ''}
          Address: ${invoice.customer.address}<br>
          ${invoice.customer.gstin ? `GSTIN: ${invoice.customer.gstin}` : ''}
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Product Code</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>GST %</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.product.code}</td>
              <td>${item.product.name}</td>
              <td>${item.quantity}</td>
              <td class="text-right">₹${item.unitPrice.toFixed(2)}</td>
              <td class="text-right">₹${(item.quantity * item.unitPrice).toFixed(2)}</td>
              <td class="text-right">${item.product.gstRate}%</td>
              <td class="text-right">₹${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <div style="width: 50%; margin-left: auto;">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Discount:</span>
            <span>-₹${invoice.discount.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>CGST + SGST (18%):</span>
            <span>₹${invoice.tax.toFixed(2)}</span>
          </div>
          <div class="total-row final-total">
            <span>Grand Total:</span>
            <span>₹${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="gst-details">
        <strong>GST Details:</strong><br>
        This is a computer generated invoice and does not require signature.<br>
        Terms & Conditions: Payment due within 30 days. All disputes subject to local jurisdiction.
      </div>

      <div class="footer">
        <p>Thank you for your business!<br>
        Visit us again for all your paint needs.</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  printWindow.focus();
  
  // Auto print after a short delay
  setTimeout(() => {
    printWindow.print();
  }, 1000);
};
