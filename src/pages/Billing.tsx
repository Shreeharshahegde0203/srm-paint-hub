
import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { useCompanyInfo } from "../contexts/CompanyInfoContext";
import { setCompanyInfoForPDF } from "../utils/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { toast } from "@/hooks/use-toast";
import { useSupabaseInvoices, Invoice } from "../hooks/useSupabaseInvoices";
import { InvoiceHistoryTable } from "../components/InvoiceHistoryTable";
import { CreateInvoiceForm } from "../components/CreateInvoiceForm";
import EditInvoiceForm from "../components/EditInvoiceForm";
import ConfirmDialog from "../components/ConfirmDialog";

const Billing = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<null | Invoice>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<null | Invoice>(null);

  const {
    invoices,
    loading: invoicesLoading,
    fetchInvoices,
    editInvoice,
    deleteInvoice,
  } = useSupabaseInvoices();
  const { products } = useSupabaseProducts();
  const { companyInfo } = useCompanyInfo();

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const number = (invoices.length + 1).toString().padStart(3, '0');
    return `INV-${year}-${number}`;
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    setCompanyInfoForPDF(companyInfo);
    
    const { data: items } = await supabase
      .from("invoice_items").select("*").eq("invoice_id", invoice.id);
    const { data: customer } = await supabase
      .from("customers").select("*").eq("id", invoice.customer_id).maybeSingle();

    const invoiceNumber = invoice.id?.slice(0, 8) || generateInvoiceNumber();
    const dateObj = invoice.created_at ? new Date(invoice.created_at) : new Date();
    const date = dateObj.toLocaleDateString("en-IN");
    const time = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const subtotal = (items || []).reduce((sum, i) => sum + i.quantity * i.price, 0);
    const gstAmount = invoice.billing_mode === 'with_gst' ? subtotal * 0.18 : 0;
    const total = subtotal + gstAmount;

    generateInvoicePDF({
      invoiceNumber,
      date,
      time,
      customer: {
        name: customer?.name || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
        email: customer?.email || undefined,
        gstin: (customer as any)?.gstin || undefined,
      },
      items: (items || []).map((item) => {
        const prod = products?.find((p) => p.id === item.product_id);
        return {
          product: {
            name: prod?.name || "",
            code: prod?.code || "",
            gstRate: prod?.gst_rate || 18,
            hsn_code: prod?.hsn_code || "",
          },
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.quantity * item.price,
        };
      }),
      subtotal,
      discount: 0,
      tax: gstAmount,
      total,
      billType: invoice.bill_type as 'gst' | 'non_gst' | 'casual',
    });
  };

  const handleView = (invoice: Invoice) => {
    // Implement view logic
    console.log("View invoice:", invoice);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="mr-3 h-8 w-8 text-blue-600" />
                Invoice Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your invoices with GST compliance and PDF generation
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center font-semibold"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Invoice History */}
        {invoicesLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">Loading invoices...</div>
          </div>
        ) : (
          <InvoiceHistoryTable
            invoices={invoices}
            onEdit={setEditingInvoice}
            onDelete={setDeletingInvoice}
            onDownloadPDF={handleDownloadPDF}
            onView={handleView}
          />
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateForm && (
        <CreateInvoiceForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={fetchInvoices}
        />
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <EditInvoiceForm
          invoice={editingInvoice}
          products={products || []}
          onSave={async (newData) => {
            await editInvoice(editingInvoice.id, newData);
            setEditingInvoice(null);
          }}
          onCancel={() => setEditingInvoice(null)}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deletingInvoice}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        onConfirm={async () => {
          if (deletingInvoice) {
            await deleteInvoice(deletingInvoice.id);
            setDeletingInvoice(null);
          }
        }}
        onCancel={() => setDeletingInvoice(null)}
      />
    </div>
  );
};

export default Billing;
