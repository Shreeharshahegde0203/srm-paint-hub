
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
    tagline: "Shreeram Building, Nadigalli, SIRSI-581401 (U.K.)",
    address: "Dealers in: ICI, Dulux Paints, Indigo Paints and Painting Assessories",
    phone: "M: 9448376055",
    email: "",
    gstin: "",
    logoUrl: "",
    footer: "* Goods once sold cannot be taken back or exchanged.\n* All disputes are Subject to Sirsi Jurisdiction.",
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
        <title>Casual Bill ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: 'Courier New', monospace; margin: 20px; font-size: 12px; line-height: 1.4; }
          .center { text-align: center; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .header { font-weight: bold; margin-bottom: 15px; }
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
          <strong>CASUAL BILL (No Price)</strong>
        </div>
        
        <div class="divider"></div>
        
        <div>
          Date: ${escapeHTML(invoice.date)} Time: ${escapeHTML(invoice.time)}<br>
          Bill No: ${escapeHTML(invoice.invoiceNumber)}<br>
          Customer: ${escapeHTML(invoice.customer.name)}
        </div>
        
        <div class="divider"></div>
        
        <div style="font-weight: bold;">
          Item${' '.repeat(15)}Qty  Unit  PerUnit
        </div>
        <div class="divider"></div>
        
        ${invoice.items.map(item => {
          const itemName = `${item.product.name}${item.product.base ? ` (${item.product.base})` : ''}${item.colorCode ? ` - ${item.colorCode}` : ''}`;
          const displayName = itemName.substring(0, 15).padEnd(15);
          const qty = item.quantity.toString().padStart(3);
          const unit = item.product.name.toLowerCase().includes('inch') ? 'In' : 'Pc';
          const perUnit = '1 ' + unit;
          const returnedClass = item.isReturned ? ' class="returned"' : '';
          const returnedText = item.isReturned ? ' (RETURNED)' : '';
          
          return `<div${returnedClass}>${displayName} ${qty}  ${unit.padEnd(4)} ${perUnit}${returnedText}</div>`;
        }).join('')}
        
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
    // GST Bill Format - Updated to include returned items
    invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; line-height: 1.3; }
          .header { text-align: center; border: 2px solid #000; padding: 10px; margin-bottom: 20px; }
          .company-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .company-details { font-size: 11px; margin-bottom: 10px; }
          .bill-type { font-size: 12px; font-weight: bold; border: 1px solid #000; padding: 2px 8px; display: inline-block; }
          .invoice-details { margin: 15px 0; }
          .customer-details { margin: 15px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #000; padding: 8px 4px; text-align: left; font-size: 11px; }
          .table th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .totals { margin-top: 20px; }
          .total-row { display: flex; justify-content: space-between; padding: 3px 0; }
          .grand-total { font-weight: bold; font-size: 14px; border-top: 2px solid #000; padding-top: 8px; }
          .footer { margin-top: 30px; font-size: 10px; }
          .bank-details { margin-top: 15px; font-size: 10px; }
          .signature-section { margin-top: 30px; display: flex; justify-content: space-between; }
          .rupees-in-words { margin-top: 15px; border: 1px solid #000; padding: 5px; }
          .returned-item { color: red; font-style: italic; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">SHREERAM MARKETING</div>
          <div class="company-details">
            Shreeram Building, Nadigalli, SIRSI-581401 (U.K.)<br>
            Dealers in: ICI, Dulux Paints, Indigo Paints and Painting Assessories
          </div>
          <div style="margin-top: 10px;">
            <span class="bill-type">${invoice.billType === 'non_gst' ? 'NON-GST BILL' : 'CASH / CREDIT BILL'}</span>
            <span style="float: right; font-weight: bold;">M: 9448376055</span>
          </div>
        </div>

        <div class="invoice-details">
          <div style="float: left;">
            <strong>No. ${escapeHTML(invoice.invoiceNumber)}</strong>
          </div>
          <div style="float: right;">
            <strong>Date: ${escapeHTML(invoice.date)}</strong>
          </div>
          <div style="clear: both;"></div>
        </div>

        <div class="customer-details">
          <div><strong>To: ${escapeHTML(invoice.customer.name)}</strong></div>
          ${invoice.customer.address ? `<div>${escapeHTML(invoice.customer.address)}</div>` : ''}
          ${invoice.customer.phone ? `<div>Phone: ${escapeHTML(invoice.customer.phone)}</div>` : ''}
          ${invoice.billType === 'gst' && invoice.customer.gstin ? `<div><strong>GST of Buyer: ${escapeHTML(invoice.customer.gstin)}</strong></div>` : ''}
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 35%;">Description Of Goods</th>
              <th style="width: 12%;">HSN Code</th>
              <th style="width: 10%;">Quantity</th>
              <th style="width: 10%;">Rate</th>
              <th style="width: 15%;">Amount</th>
              <th style="width: 8%;">Rs.</th>
              <th style="width: 10%;">Ps.</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => {
              const itemDescription = `${item.product.name}${item.product.base ? ` (${item.product.base})` : ''}${item.colorCode ? ` - ${item.colorCode}` : ''}`;
              const displayAmount = item.isReturned ? -item.total : item.total;
              const returnedClass = item.isReturned ? ' class="returned-item"' : '';
              const returnedText = item.isReturned ? ' (RETURNED)' : '';
              
              return `
                <tr${returnedClass}>
                  <td>${escapeHTML(itemDescription)}${returnedText}</td>
                  <td class="text-center">${escapeHTML(item.product.hsn_code || '')}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">₹${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right">₹${displayAmount.toFixed(2)}</td>
                  <td class="text-right">${Math.floor(Math.abs(displayAmount))}</td>
                  <td class="text-right">${Math.round((Math.abs(displayAmount) % 1) * 100)}</td>
                </tr>
              `;
            }).join('')}
            ${Array.from({ length: Math.max(0, 8 - invoice.items.length) }, () => `
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between;">
          <div style="width: 48%;">
            <div class="rupees-in-words">
              <strong>Rupees in words:</strong><br>
              ${numberToWords(Math.abs(invoice.total))} Only
            </div>
            
            <div class="bank-details">
              <strong>Karnataka Bank, Sirsi</strong><br>
              A/c. No. 707200010040901<br>
              IFSC: KARB0000707<br>
              A/c. Holder Name: GAJANAN N. HEGDE
            </div>
          </div>
          
          <div style="width: 48%;">
            <div class="totals">
              <div class="total-row">
                <span>Sub Total</span>
                <span>₹${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Net Value</span>
                <span>₹${invoice.subtotal.toFixed(2)}</span>
              </div>
              ${invoice.billType === 'gst' ? `
              <div class="total-row">
                <span>CGST@</span>
                <span>₹${(invoice.tax / 2).toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>SGST@</span>
                <span>₹${(invoice.tax / 2).toFixed(2)}</span>
              </div>
              ` : ''}
              <div class="total-row">
                <span>Freight</span>
                <span>-</span>
              </div>
              <div class="total-row grand-total">
                <span>GRAND TOTAL</span>
                <span>₹${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div style="text-align: right; margin-bottom: 20px;">
            <strong>For Shreeram Marketing</strong>
          </div>
        </div>

        <div class="signature-section">
          <div>
            <strong>Customer's Signature</strong>
          </div>
          <div>
            <strong>Signature</strong>
          </div>
        </div>

        <div style="margin-top: 20px; font-size: 10px; text-align: center;">
          * Goods once sold cannot be taken back or exchanged.<br>
          * All disputes are Subject to Sirsi Jurisdiction.
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
