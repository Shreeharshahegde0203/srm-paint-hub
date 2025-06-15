
import React from "react";
import { useCompanyInfo } from "../contexts/CompanyInfoContext";

// Minimal sample invoice
const sampleInvoice = {
  invoiceNumber: "SRM-2024-TEST",
  date: "2024-06-15",
  time: "12:00 PM",
  customer: {
    name: "Sample Customer",
    phone: "+91 98765 43210",
    address: "12 ABC Street, City",
    email: "sample@email.com",
    gstin: "27AABCU9603R1ZZ"
  },
  items: [
    {
      product: { name: "Super White Emulsion", code: "SW101", gstRate: 18 },
      quantity: 2,
      unitPrice: 1500,
      total: 3000
    }
  ],
  subtotal: 3000,
  discount: 150,
  tax: 513,
  total: 3363
};

export default function InvoiceTemplatePreview() {
  const { companyInfo } = useCompanyInfo();

  return (
    <div className="border rounded bg-white p-4 overflow-x-auto max-w-full shadow-inner">
      <div style={{ color: companyInfo.invoiceColors.text }}>
        <div
          className="header"
          style={{
            textAlign: "center",
            borderBottom: `2px solid ${companyInfo.invoiceColors.accent}`,
            paddingBottom: "16px",
            marginBottom: "18px"
          }}
        >
          <div
            className="logo"
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: companyInfo.invoiceColors.primary,
              marginBottom: "5px"
            }}
          >
            {companyInfo.logoUrl ? (
              <img src={companyInfo.logoUrl} alt="logo" className="inline-block max-h-12" />
            ) : (
              "SRM"
            )}
          </div>
          <div
            className="company-name"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: companyInfo.invoiceColors.accent
            }}
          >
            {companyInfo.name}
          </div>
          <div className="company-details" style={{ color: "#666", fontSize: "13px" }}>
            {companyInfo.tagline}
            <br />
            Address: {companyInfo.address}
            <br />
            Phone: {companyInfo.phone} | Email: {companyInfo.email}
            <br />
            GSTIN: {companyInfo.gstin}
          </div>
        </div>
        <div
          className="invoice-info"
          style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}
        >
          <div
            className="info-box"
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "5px",
              width: "45%"
            }}
          >
            <b>Invoice No:</b> {sampleInvoice.invoiceNumber}
            <br />
            <b>Date:</b> {sampleInvoice.date}
            <br />
            <b>Time:</b> {sampleInvoice.time}
          </div>
          <div
            className="info-box"
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "5px",
              width: "45%"
            }}
          >
            <b>Bill To:</b> <br />
            <span>{sampleInvoice.customer.name}</span>
            <br />
            Phone: {sampleInvoice.customer.phone}
            <br />
            Email: {sampleInvoice.customer.email}
            <br />
            Address: {sampleInvoice.customer.address}
            <br />
            GSTIN: {sampleInvoice.customer.gstin}
          </div>
        </div>
        <table
          className="table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            margin: "12px 0"
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", fontWeight: "bold", background: "#f8f9fa" }}>S.No</th>
              <th style={{ border: "1px solid #ddd", background: "#f8f9fa" }}>Product Code</th>
              <th style={{ border: "1px solid #ddd", background: "#f8f9fa" }}>Description</th>
              <th style={{ border: "1px solid #ddd", background: "#f8f9fa" }}>Qty</th>
              <th style={{ border: "1px solid #ddd", background: "#f8f9fa" }}>Rate</th>
              <th style={{ border: "1px solid #ddd", background: "#f8f9fa" }}>Amount</th>
              <th style={{ border: "1px solid #ddd", background: "#f8f9fa" }}>GST %</th>
              <th style={{ border: "1px solid #ddd", background: "#f8f9fa" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sampleInvoice.items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ddd", padding: "2px 6px" }}>{idx + 1}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px 6px" }}>{item.product.code}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px 6px" }}>{item.product.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px 6px" }}>{item.quantity}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px 6px", textAlign: "right" }}>₹{item.unitPrice.toFixed(2)}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px 6px", textAlign: "right" }}>₹{(item.quantity*item.unitPrice).toFixed(2)}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px 6px", textAlign: "right" }}>{item.product.gstRate}%</td>
                <td style={{ border: "1px solid #ddd", padding: "2px 6px", textAlign: "right" }}>₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ width: "50%", marginLeft: "auto" }}>
          <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal:</span>
            <span>₹{sampleInvoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Discount:</span>
            <span>-₹{sampleInvoice.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>CGST + SGST (18%):</span>
            <span>₹{sampleInvoice.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold" style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "18px",
            borderTop: "2px solid #333",
            paddingTop: "8px"
          }}>
            <span>Grand Total:</span>
            <span>₹{sampleInvoice.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="gst-details" style={{ marginTop: 16, fontSize: 12 }}>
          <strong>GST Details:</strong>
          <br />
          {(companyInfo.terms || "").split("\\n").map((l, i) => (
            <span key={i}>
              {l}
              <br />
            </span>
          ))}
        </div>
        <div className="footer" style={{
          marginTop: 18,
          paddingTop: 10,
          borderTop: "1px solid #ddd",
          textAlign: "center",
          color: "#555"
        }}>
          {(companyInfo.footer || "")
            .split("\\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
