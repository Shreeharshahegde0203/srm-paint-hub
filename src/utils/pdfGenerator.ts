
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

// Plain JS access to company info (since context not available in pure JS file)
let _companyInfo: any;
export function setCompanyInfoForPDF(companyInfo: any) {
  _companyInfo = companyInfo;
}

export const generateInvoicePDF = (invoice: InvoiceData) => {
  const company = _companyInfo || {
    name: "SHREERAM MARKETING",
    tagline: "Premium Paints & Coatings Dealer",
    address: "[Your Address Here]",
    phone: "[Your Phone]",
    email: "[Your Email]",
    gstin: "[Your GSTIN Number]",
    logoUrl: "",
    footer: "Thank you for your business!\\nVisit us again for all your paint needs.",
    terms: "This is a computer generated invoice and does not require signature.\\nTerms & Conditions: Payment due within 30 days. All disputes subject to local jurisdiction.",
    invoiceColors: { primary: "#1e3a8a", accent: "#dc2626", text: "#333" }
  };

  // Create new window for invoice
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('Please allow popups to download the invoice');
    return;
  }

  // escapeHTML helper for user content
  const escapeHTML = (str: string = "") =>
    str.replace(/[&<>"']/g, m =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m] || m)
    );

  // Format logo HTML
  const logoHTML = company.logoUrl
    ? `<img src="${company.logoUrl}" alt="Logo" style="max-height:48px;" />`
    : `<span style="font-size:28px;font-weight:bold;color:${company.invoiceColors.primary};">SRM</span>`;

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: ${company.invoiceColors.text}; }
        .header { text-align: center; border-bottom: 2px solid ${company.invoiceColors.accent}; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { margin-bottom: 5px; }
        .company-name { font-size: 24px; font-weight: bold; color: ${company.invoiceColors.accent}; margin-bottom: 5px; }
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
        <div class="logo">${logoHTML}</div>
        <div class="company-name">${escapeHTML(company.name)}</div>
        <div class="company-details">
          ${escapeHTML(company.tagline)}<br>
          Address: ${escapeHTML(company.address)}<br>
          Phone: ${escapeHTML(company.phone)} | Email: ${escapeHTML(company.email)}<br>
          GSTIN: ${escapeHTML(company.gstin)}
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
          <strong>${escapeHTML(invoice.customer.name)}</strong><br>
          Phone: ${escapeHTML(invoice.customer.phone)}<br>
          ${invoice.customer.email ? `Email: ${escapeHTML(invoice.customer.email)}<br>` : ''}
          Address: ${escapeHTML(invoice.customer.address)}<br>
          ${invoice.customer.gstin ? `GSTIN: ${escapeHTML(invoice.customer.gstin)}` : ''}
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
              <td>${escapeHTML(item.product.code)}</td>
              <td>${escapeHTML(item.product.name)}</td>
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
        ${(company.terms || "").replace(/\\n/g, "<br>")}
      </div>

      <div class="footer">
        ${(company.footer || "").replace(/\\n/g, "<br>")}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  printWindow.focus();

  // Auto print after delay
  setTimeout(() => {
    printWindow.print();
  }, 800);
};
