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
import EnhancedBillingForm from "../components/EnhancedBillingForm";
import EditInvoiceForm from "../components/EditInvoiceForm";
import ConfirmDialog from "../components/ConfirmDialog";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

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

  const handleSaveBill = async (billData: any) => {
    try {
      // Create customer first
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .insert({
          name: billData.customer.name,
          phone: billData.customer.phone,
          address: billData.customer.address,
          email: billData.customer.email,
          customer_number: billData.customer.customer_number,
          gstin: billData.customer.gstin
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Create invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          customer_id: customerData.id,
          total: billData.total,
          discount: billData.discount || 0,
          bill_type: billData.billType,
          billing_mode: billData.billType === 'gst' ? 'with_gst' : billData.billType === 'non_gst' ? 'without_gst' : 'casual',
          status: billData.paymentStatus,
          partial_amount_paid: billData.paymentStatus === 'partially_paid' ? billData.partialAmount : 0
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      const itemsToInsert = billData.items.map((item: any) => ({
        invoice_id: invoiceData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.unitPrice,
        price_excluding_gst: item.priceExcludingGst,
        gst_percentage: item.gstPercentage,
        unit_quantity: item.unitQuantity, // pack size
        unit_type: (item as any).quantityType,
        color_code: item.colorCode,
        base: item.product.base
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // Handle returned items
      const returnedItems = billData.items.filter((item: any) => item.isReturned);
      if (returnedItems.length > 0) {
        const returnedItemsToInsert = returnedItems.map((item: any) => ({
          invoice_id: invoiceData.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.priceExcludingGst,
          return_reason: item.returnReason
        }));

        const { error: returnError } = await supabase
          .from("invoice_returned_items")
          .insert(returnedItemsToInsert);

        if (returnError) throw returnError;

        // Update product stock for returned items
        for (const item of returnedItems) {
          const { error: stockError } = await supabase
            .from("products")
            .update({ 
              stock: item.product.stock + item.quantity 
            })
            .eq("id", item.product.id);

          if (stockError) throw stockError;
        }
      }

      // Update product stock for sold items
      const soldItems = billData.items.filter((item: any) => !item.isReturned);
      for (const item of soldItems) {
        const { error: stockError } = await supabase
          .from("products")
          .update({ 
            stock: Math.max(0, item.product.stock - item.quantity)
          })
          .eq("id", item.product.id);

        if (stockError) throw stockError;
      }

      toast({
        title: "Success",
        description: "Bill created successfully!",
      });

      setShowCreateForm(false);
      fetchInvoices();
    } catch (error) {
      console.error('Error creating bill:', error);
      toast({
        title: "Error",
        description: "Failed to create bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    setCompanyInfoForPDF(companyInfo);
    
    const { data: items } = await supabase
      .from("invoice_items").select("*").eq("invoice_id", invoice.id);
    const { data: customer } = await supabase
      .from("customers").select("*").eq("id", invoice.customer_id).maybeSingle();
    const { data: returnedItems } = await supabase
      .from("invoice_returned_items").select("*").eq("invoice_id", invoice.id);

    const invoiceNumber = invoice.id?.slice(0, 8) || generateInvoiceNumber();
    const dateObj = invoice.created_at ? new Date(invoice.created_at) : new Date();
    const date = dateObj.toLocaleDateString("en-IN");
    const time = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    // Process regular items
    const regularItems = (items || []).map((item) => {
      const prod = products?.find((p) => p.id === item.product_id);
      // Extract just the unit type (e.g., 'Kg') from unit_type or product.unit
      let unitType = '';
      if (item.unit_type) {
        unitType = item.unit_type.split(' ').slice(-1)[0];
      } else if (prod?.unit) {
        unitType = prod.unit.split(' ').slice(-1)[0];
      }
      return {
        product: {
          name: prod?.name || "",
          base: item.base || prod?.base,
          gstRate: prod?.gst_rate || 18,
          hsn_code: prod?.hsn_code || "",
        },
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.quantity * item.price,
        colorCode: item.color_code || "",
        unitType,
        unitQuantity: (item as any).unit_quantity || 1, // already present
        isReturned: false,
      };
    });

    // Process returned items
    const processedReturnedItems = (returnedItems || []).map((item) => {
      const prod = products?.find((p) => p.id === item.product_id);
      return {
        product: {
          name: prod?.name || "",
          base: prod?.base,
          gstRate: prod?.gst_rate || 18,
          hsn_code: prod?.hsn_code || "",
        },
        quantity: item.quantity,
        unitPrice: item.unit_price,
        total: -(item.quantity * item.unit_price), // Negative for returns
        colorCode: "",
        isReturned: true,
        returnReason: item.return_reason,
      };
    });

    const allItems = [...regularItems, ...processedReturnedItems];
    const subtotal = regularItems.reduce((sum, i) => sum + i.total, 0);
    const returnTotal = processedReturnedItems.reduce((sum, i) => sum + Math.abs(i.total), 0);
    const netSubtotal = subtotal - returnTotal;
    
    let gstAmount = 0;
    if (invoice.billing_mode === 'with_gst') {
      gstAmount = netSubtotal * 0.18 / 1.18;
    }
    
    const total = netSubtotal;

    // Debug: Log items to check unitQuantity and unitType
    console.log('PDF Items:', allItems);

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
      items: allItems,
      subtotal: netSubtotal,
      discount: Number((invoice as any).discount) || 0,
      tax: gstAmount,
      total,
      billType: invoice.bill_type as 'gst' | 'non_gst' | 'casual',
    });
  };

  const handleView = (invoice: Invoice) => {
    // Open the edit form for viewing
    setEditingInvoice(invoice);
  };

  // Convert Supabase products to the expected format for EditInvoiceForm
  const convertedProducts = products?.map((product: Product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    type: product.type,
    base: product.base,
    price: Number(product.price),
    stock: product.stock,
    gstRate: product.gst_rate,
    unit: product.unit,
    description: product.description,
    image: product.image,
    unit_quantity: product.unit_quantity,
    hsn_code: product.hsn_code,
    batchNumber: product.batch_number,
    expiryDate: product.expiry_date,
    category: product.category,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 card-hover">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center animate-fade-in">
                <FileText className="mr-3 h-8 w-8 text-blue-600 wobble-on-hover" />
                Enhanced Billing System
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Create GST, Non-GST, and Casual bills with full inventory integration
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center font-semibold transition-all duration-300 transform hover:scale-105 glow-on-hover pulse-slow"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Bill
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

      {/* Enhanced Billing Form */}
      {showCreateForm && (
        <EnhancedBillingForm
          onClose={() => setShowCreateForm(false)}
          onSave={handleSaveBill}
        />
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <EditInvoiceForm
          invoice={editingInvoice}
          products={convertedProducts}
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
