
  import { useCompanyInfo } from "../contexts/CompanyInfoContext";

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
        base?: string;
        gstRate: number;
        hsn_code?: string;
      };
      quantity: number;
      unitPrice: number;
      total: number;
      colorCode?: string;
      isReturned?: boolean;
      returnReason?: string;
      unitQuantity?: number;
      unitType?: string;
    }>;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    billType?: 'gst' | 'non_gst' | 'casual';
  }

  let _companyInfo: any;
  export function setCompanyInfoForPDF(companyInfo: any) {
    _companyInfo = companyInfo;
  }

  export const generateInvoicePDF = (invoice: InvoiceData) => {
    const company = _companyInfo || {
      name: "SHREERAM MARKETING",
      tagline: "Premium Paints & Coatings Dealer",
      address: "Shreeram Building, Nadigalli, SIRSI-581401 (U.K.)",
      phone: "M: 9448376055",
      email: "shreeram@example.com",
      gstin: "29ABCDE1234F1Z5",
      logoUrl: "",
      footer: "This is a Computer Generated Invoice",
      terms: "",
      invoiceColors: { primary: "#1e3a8a", accent: "#dc2626", text: "#333" }
    };

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow popups to download the invoice');
      return;
    }

    const escapeHTML = (str: string = "") =>
      str.replace(/[&<>"']/g, m =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m] || m)
      );

    let invoiceHTML = '';

    if (invoice.billType === 'casual') {
      // Casual Bill Format - Thermal Printer Style
      invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; margin: 20px; font-size: 12px; line-height: 1.4; }
            .center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .header { font-weight: bold; margin-bottom: 10px; }
            .item-row { display: flex; justify-content: space-between; margin: 2px 0; }
            .footer { margin-top: 20px; font-size: 10px; }
            .returned { color: red; font-style: italic; }
            @media print { body { margin: 0; font-size: 10px; } }
          </style>
        </head>
        <body>
          <div class="center header">
            ${escapeHTML(company.name)}<br>
            ${escapeHTML(company.tagline)}<br>
            ${escapeHTML(company.address)}<br>
            ${escapeHTML(company.phone)}<br>
            <strong>INVOICE</strong>
          </div>
          <div class="divider"></div>
          <div>
            Date: ${escapeHTML(invoice.date)} Time: ${escapeHTML(invoice.time)}<br>
            Bill No: ${escapeHTML(invoice.invoiceNumber)}<br>
            Customer: ${escapeHTML(invoice.customer.name)}
          </div>
          <div class="divider"></div>
          <div style="font-weight: bold; display: flex; justify-content: space-between;">
            <span>Item</span><span>Qty</span>
          </div>
          <div class="divider"></div>
          ${invoice.items.length > 0 ? invoice.items.map(item => {
            const itemName = item.product.name + (item.colorCode ? ` - ${item.colorCode}` : '');
            const qty = (typeof item.unitQuantity === 'number' && item.unitType)
              ? `${item.unitQuantity} ${item.unitType} x ${item.quantity}`
              : item.quantity;
            const returnedClass = item.isReturned ? ' class="returned"' : '';
            const returnedText = item.isReturned ? ' (RETURNED)' : '';
            return `<div${returnedClass} style="display: flex; justify-content: space-between;">
              <span>${escapeHTML(itemName)}${returnedText}</span><span>${qty}</span>
            </div>`;
          }).join('') : '<div style="text-align:center; color:#888;">No items</div>'}
          <div class="divider"></div>
          <div class="center">
            Note: No prices included.<br>
            For reference only.<br>
            Thank You! Visit Again!
          </div>
          <div class="footer center">
            ${escapeHTML(company.footer).replace(/\n/g, '<br>')}
          </div>
        </body>
        </html>
      `;
    } else {
      // Enhanced GST Bill Format
      const totalQuantity = invoice.items.reduce((sum, item) => sum + (item.isReturned ? 0 : item.quantity), 0);
      const returnedQuantity = invoice.items.reduce((sum, item) => sum + (item.isReturned ? item.quantity : 0), 0);

      // Calculate GST-exclusive subtotal for GST bills
      let pdfSubtotal = invoice.subtotal;
      let gstSummaryRows = '';
      if (invoice.billType === 'gst') {
        pdfSubtotal = invoice.items.reduce((sum, item) => {
          const gstRate = (item as any).gst_percentage || (item as any).gstPercentage || item.product.gstRate || 18;
          const exGstPrice = item.unitPrice / (1 + gstRate / 100);
          return sum + (item.isReturned ? -item.quantity * exGstPrice : item.quantity * exGstPrice);
        }, 0);
        // Group items by GST rate
        const gstGroups: Record<string, {cgst: number, sgst: number}> = {};
        invoice.items.forEach(item => {
          const gstRate = (item as any).gst_percentage || (item as any).gstPercentage || item.product.gstRate || 18;
          const cgstRate = gstRate / 2;
          const exGstPrice = item.unitPrice / (1 + gstRate / 100);
          const cgstAmount = (item.isReturned ? 0 : item.quantity * exGstPrice * (cgstRate / 100));
          const sgstAmount = (item.isReturned ? 0 : item.quantity * exGstPrice * (cgstRate / 100));
          if (!gstGroups[gstRate]) gstGroups[gstRate] = {cgst: 0, sgst: 0};
          gstGroups[gstRate].cgst += cgstAmount;
          gstGroups[gstRate].sgst += sgstAmount;
        });
        gstSummaryRows = Object.entries(gstGroups).map(([rate, {cgst, sgst}]) => `
          <tr>
            <td>&nbsp;&nbsp;- CGST @ ${(Number(rate)/2).toFixed(1)}%:</td>
            <td class="text-right">₹${cgst.toFixed(2)}</td>
          </tr>
          <tr>
            <td>&nbsp;&nbsp;- SGST @ ${(Number(rate)/2).toFixed(1)}%:</td>
            <td class="text-right">₹${sgst.toFixed(2)}</td>
          </tr>
        `).join('');
      }
      
      invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${invoice.billType === 'non_gst' ? 'Invoice' : 'Tax Invoice'} ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; line-height: 1.2; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
            .company-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
            .gstin { font-size: 12px; font-weight: bold; margin: 5px 0; }
            .address { font-size: 11px; margin: 3px 0; }
            .invoice-title { font-size: 16px; font-weight: bold; margin: 15px 0; text-align: center; border: 2px solid #000; padding: 8px; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .invoice-details { display: flex; justify-content: space-between; margin: 15px 0; }
            .customer-section { margin: 15px 0; }
            .customer-title { font-weight: bold; margin-bottom: 5px; }
            .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .table th, .table td { border: 1px solid #000; padding: 6px 4px; text-align: left; font-size: 10px; }
            .table th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .summary-section { margin-top: 20px; display: flex; justify-content: space-between; }
            .summary-left { width: 48%; }
            .summary-right { width: 48%; }
            .totals-table { width: 100%; }
            .totals-table td { padding: 4px 8px; border-bottom: 1px solid #ccc; }
            .grand-total { font-weight: bold; font-size: 14px; border-top: 2px solid #000; }
            .bank-details { border: 1px solid #000; padding: 8px; margin-top: 10px; font-size: 10px; }
            .declaration { margin-top: 15px; font-size: 10px; }
            .signature-section { margin-top: 30px; display: flex; justify-content: space-between; }
            .returned-item { color: red; text-decoration: line-through; }
            .footer-note { text-align: center; margin-top: 20px; font-size: 10px; font-style: italic; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${escapeHTML(company.name)}</div>
            <div class="gstin">GSTIN: ${escapeHTML(company.gstin)}</div>
            <div class="address">${escapeHTML(company.address)}</div>
            <div class="address">Phone: ${escapeHTML(company.phone)} | Email: ${escapeHTML(company.email)}</div>
          </div>

          <div class="divider"></div>

          <div class="invoice-title">${invoice.billType === 'non_gst' ? 'INVOICE' : 'TAX INVOICE'}</div>

          <div class="divider"></div>

          <div class="invoice-details">
            <div>
              <strong>Invoice No.: ${escapeHTML(invoice.invoiceNumber)}</strong><br>
              Delivery Note: <br>
              <strong>Buyer (Bill To):</strong><br>
              <strong>${escapeHTML(invoice.customer.name)}</strong><br>
              ${invoice.customer.address ? `Address: ${escapeHTML(invoice.customer.address)}<br>` : ''}
              ${invoice.customer.phone ? `Phone: ${escapeHTML(invoice.customer.phone)}<br>` : ''}
              ${invoice.customer.gstin ? `GSTIN: ${escapeHTML(invoice.customer.gstin)}<br>` : ''}
              State: Karnataka, Code: 29
            </div>
            <div style="text-align: right;">
              <strong>Date: ${escapeHTML(invoice.date)}</strong><br>
              Mode/Terms of Payment: ${escapeHTML(company.paymentTerms || 'Cash')}<br>
              Dispatch Through: ${escapeHTML(company.dispatchThrough || '')}<br>
              Destination: ${escapeHTML(company.destination || '')}<br>
              Terms of Delivery: ${escapeHTML(company.deliveryTerms || '')}
            </div>
          </div>

          ${generateItemTables(invoice, escapeHTML)}

          <div style="margin: 15px 0;">
            <strong>Total Quantity: ${totalQuantity} units</strong>
            ${returnedQuantity > 0 ? ` | Returned: ${returnedQuantity} units` : ''}
          </div>

          <div class="summary-section">
            <div class="summary-left">
              <div style="border: 1px solid #000; padding: 8px; margin-bottom: 15px;">
                <strong>In Words:</strong><br>
                ${numberToWords(Math.abs(invoice.total))} Only
              </div>
              
              <div class="bank-details">
                <strong>Bank Details:</strong><br>
                Bank Name: Karnataka Bank<br>
                A/c No.: 707200010040901<br>
                IFSC Code: KARB0000707<br>
                Branch: Sirsi
              </div>
            </div>
            
            <div class="summary-right">
              <table class="totals-table">
                ${invoice.billType === 'non_gst' ? `
                  <tr>
                    <td>Subtotal:</td>
                    <td class="text-right">₹${(invoice.total + (invoice.discount || 0)).toFixed(2)}</td>
                  </tr>
                  ${invoice.discount && invoice.discount > 0 ? `
                  <tr>
                    <td>Discount:</td>
                    <td class="text-right">-₹${invoice.discount.toFixed(2)}</td>
                  </tr>
                  ` : ''}
                  <tr class="grand-total">
                    <td><strong>Grand Total:</strong></td>
                    <td class="text-right"><strong>₹${invoice.total.toFixed(2)}</strong></td>
                  </tr>
                ` : `
                  <tr>
                    <td>Subtotal (Excl. GST):</td>
                    <td class="text-right">₹${pdfSubtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Taxes:</td>
                    <td></td>
                  </tr>
                  ${gstSummaryRows}
                  <tr>
                    <td><strong>Total (Incl. GST):</strong></td>
                    <td class="text-right"><strong>₹${(pdfSubtotal + pdfGstAmount + (invoice.discount || 0)).toFixed(2)}</strong></td>
                  </tr>
                  ${invoice.discount && invoice.discount > 0 ? `
                  <tr>
                    <td>Discount:</td>
                    <td class="text-right">-₹${invoice.discount.toFixed(2)}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td>Round Off:</td>
                    <td class="text-right">₹0.00</td>
                   </tr>
                   <tr class="grand-total">
                     <td><strong>Grand Total:</strong></td>
                     <td class="text-right"><strong>₹${invoice.total.toFixed(2)}</strong></td>
                   </tr>
                 `}
              </table>
            </div>
          </div>

          <div class="declaration">
            <strong>Declaration:</strong><br>
            We declare that this invoice shows the actual price of the goods 
            described and that all particulars are true and correct.
          </div>

          <div class="signature-section">
            <div>
              <strong>Customer's Signature</strong>
            </div>
            <div>
              <strong>Authorised Signatory: ___________________</strong>
            </div>
          </div>

          <div class="footer-note">
            ${escapeHTML(company.footer)}
          </div>
        </body>
        </html>
      `;
    }

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  // Helper function to convert numbers to words
  function numberToWords(amount: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function convertHundreds(num: number): string {
      let result = '';
      
      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + ' Hundred ';
        num %= 100;
      }
      
      if (num >= 20) {
        result += tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num >= 10) {
        result += teens[num - 10] + ' ';
        return result;
      }
      
      if (num > 0) {
        result += ones[num] + ' ';
      }
      
      return result;
    }
    
    let rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    
    let result = '';
    
    if (rupees >= 10000000) {
      result += convertHundreds(Math.floor(rupees / 10000000)) + 'Crore ';
      rupees %= 10000000;
    }
    
    if (rupees >= 100000) {
      result += convertHundreds(Math.floor(rupees / 100000)) + 'Lakh ';
      rupees %= 100000;
    }
    
    if (rupees >= 1000) {
      result += convertHundreds(Math.floor(rupees / 1000)) + 'Thousand ';
      rupees %= 1000;
    }
    
    if (rupees > 0) {
      result += convertHundreds(rupees);
    }
    
    result += 'Rupees';
    
    if (paise > 0) {
      result += ' and ' + convertHundreds(paise) + 'Paise';
    }
    
    return result.trim();
  }

  // Generate paginated tables for items (8 items per page)
  function generateItemTables(invoice: any, escapeHTML: (str: string) => string): string {
    const itemsPerPage = 8;
    const totalPages = Math.ceil(invoice.items.length / itemsPerPage);
    let tables = '';

    for (let page = 0; page < totalPages; page++) {
      const startIndex = page * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, invoice.items.length);
      const pageItems = invoice.items.slice(startIndex, endIndex);
      
      // Add page break before subsequent pages
      const pageBreak = page > 0 ? '<div style="page-break-before: always;"></div>' : '';
      
      tables += `
        ${pageBreak}
        <table class="table">
          <thead>
            <tr>
              <th style="width: 8%;">S.No</th>
              <th style="width: 52%;">Description of Goods</th>
              <th style="width: 10%;">Qty</th>
              <th style="width: 15%;">Rate</th>
              <th style="width: 15%;">Amt</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.map((item, index) => {
              console.log('PDF Qty Item:', item);
              const colorCode = item.colorCode || '';
              const itemDescription = `${item.product.name}${colorCode ? ` - ${colorCode}` : ''}`;
              const displayAmount = item.isReturned ? -Math.abs(item.total) : item.total;
              const itemClass = item.isReturned ? ' class="returned-item"' : '';
              const returnedText = item.isReturned ? ' (RETURNED)' : '';
              
              // Calculate GST-exclusive rate and total for GST bills
              let exGstRate = item.unitPrice;
              let exGstTotal = item.total;
              if (invoice.billType === 'gst') {
                exGstRate = (item.unitPrice / 1.18);
                exGstTotal = item.quantity * exGstRate;
              }
              return `
                <tr${itemClass}>
                  <td class="text-center">${startIndex + index + 1}</td>
                  <td>${escapeHTML(itemDescription)}${returnedText}</td>
                  <td class="text-center">${
                    (typeof item.unitQuantity === 'number' && item.unitType)
                      ? `${item.unitQuantity} ${item.unitType} x ${item.quantity}`
                      : item.quantity
                  }</td>
                  <td class="text-right">₹${exGstRate.toFixed(2)}</td>
                  <td class="text-right">₹${exGstTotal.toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
            ${page === totalPages - 1 ? '' : '<tr><td colspan="5" style="text-align: center; padding: 10px; font-style: italic;">Continued on next page...</td></tr>'}
          </tbody>
        </table>
        ${page < totalPages - 1 ? '<div style="margin: 20px 0; text-align: center; font-weight: bold;">Page ' + (page + 1) + ' of ' + totalPages + '</div>' : ''}
      `;
    }
    
    return tables;
  }
