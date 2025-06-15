import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Download, Eye, Trash2, Edit } from 'lucide-react';
import ProductSelector from '../components/ProductSelector';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { useCompanyInfo } from "../contexts/CompanyInfoContext";
import { setCompanyInfoForPDF } from "../utils/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { toast } from "@/components/ui/use-toast";
import TradeReceivablesDialog from "../components/TradeReceivablesDialog";
import type { Tables } from "@/integrations/supabase/types";
import { useSupabaseInvoices, Invoice, Product } from "../hooks/useSupabaseInvoices";
import EditInvoiceForm from "../components/EditInvoiceForm";
import ConfirmDialog from "../components/ConfirmDialog";
import CustomerHistoryModal from "../components/CustomerHistoryModal";
import { Eye as EyeIcon, Download as DownloadIcon } from 'lucide-react';
import RegularCustomersSection from "../components/RegularCustomersSection";
import EnhancedProductSelector from "../components/EnhancedProductSelector";

// --- Type definitions for Supabase integration ---
type Customer = Tables<"customers">;
type InvoiceItem = Tables<"invoice_items"> & {
  product?: Product;
};

// --- Supabase hooks for invoices ---
// (moved to useSupabaseInvoices.ts)

// --- Billing Component ---
const Billing = () => {
  // --- Invoices + Products state ---
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'invoices' | 'products' | 'regular_customers'>('invoices');

  // --- Hooked data ---
  const {
    invoices,
    loading: invoicesLoading,
    fetchInvoices,
    editInvoice,
    deleteInvoice,
  } = useSupabaseInvoices();
  const { products, addProduct, updateProduct, deleteProduct, isLoading: productsLoading } = useSupabaseProducts();
  const { companyInfo } = useCompanyInfo();

  // --- Filter logic for invoices ---
  const filteredInvoices = invoices.filter(invoice => {
    const cust = invoice.customer;
    return (cust?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status?.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // --- Invoice number generation ---
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const number = (invoices.length + 1).toString().padStart(3, '0');
    return `SRM-${year}-${number}`;
  };

  // --- Download PDF using live fetch ---
  const handleDownloadPDF = async (invoice: Invoice) => {
    setCompanyInfoForPDF(companyInfo);
    // Fetch full items and products for PDF
    const { data: items } = await supabase
      .from("invoice_items").select("*").eq("invoice_id", invoice.id);
    const { data: customer } = await supabase
      .from("customers").select("*").eq("id", invoice.customer_id).maybeSingle();

    // Generate invoice number in the same format as elsewhere
    const invoiceNumber =
      (invoice.id && typeof invoice.id === "string" ? invoice.id : generateInvoiceNumber());
    // Date and time fields based on invoice or now
    const dateObj = invoice.created_at
      ? new Date(invoice.created_at)
      : new Date();
    const date = dateObj.toLocaleDateString("en-IN");
    const time = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    // Compose PDF input using fetched data as required by InvoiceData
    generateInvoicePDF({
      invoiceNumber,
      date,
      time,
      customer: {
        name: customer?.name ?? "",
        phone: customer?.phone ?? "",
        address: customer?.address ?? "",
        email: customer?.email ?? undefined,
        gstin: (customer as any)?.gstin ?? undefined, // just in case
      },
      items: (items ?? []).map((item) => {
        const prod = products?.find((p) => p.id === item.product_id);
        return {
          product: {
            name: prod?.name ?? "",
            code: prod?.code ?? "",
            gstRate: prod?.gst_rate ?? 18,
          },
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.quantity * item.price,
        };
      }),
      subtotal: (items ?? []).reduce((sum, i) => sum + i.quantity * i.price, 0),
      discount: 0,
      tax: ((items ?? []).reduce((sum, i) => sum + i.quantity * i.price, 0)) * 0.18,
      total: (items ?? []).reduce((sum, i) => sum + i.quantity * i.price, 0) * 1.18,
    });
  };

  // --- Creation modal ---
  const CreateInvoiceForm = ({ onClose }: { onClose: () => void }) => {
    const [customerData, setCustomerData] = useState<Partial<Customer>>({
      name: '', phone: '', address: '', email: ''
    });
    // Store items as full Tables<"products"> not mapped Product
    const [items, setItems] = useState<any[]>([{ product: undefined, quantity: 1, unitPrice: 0, total: 0 }]);
    const [discount, setDiscount] = useState(0);
    const [status, setStatus] = useState('pending'); // Paid/Pending/Overdue

    // Add item, update item helpers
    const addItem = () =>
      setItems([...items, { product: undefined, quantity: 1, unitPrice: 0, total: 0 }]);
    const updateItem = (idx: number, field: string, value: any) => {
      const arr = [...items];
      arr[idx] = { ...arr[idx], [field]: value };
      if (['quantity', 'unitPrice'].includes(field)) {
        const quantity = field === 'quantity' ? value : arr[idx].quantity || 0;
        const unitPrice = field === 'unitPrice' ? value : arr[idx].unitPrice || 0;
        arr[idx].total = quantity * unitPrice;
      }
      setItems(arr);
    };

    // --- Replace legacy ProductSelector with new EnhancedProductSelector ---
    const handleProductSelect = (idx: number, product: any) => {
      const arr = [...items];
      arr[idx] = {
        ...arr[idx],
        product, // EnhancedProductSelector returns a mapped Product (from unified)
        unitPrice: product.price,
        total: (arr[idx].quantity || 1) * product.price
      };
      setItems(arr);
    };

    const removeItem = (idx: number) => {
      if (items.length > 1) setItems(items.filter((_, i) => i !== idx));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discountAmount = (subtotal * discount) / 100;
    const tax = (subtotal - discountAmount) * 0.18;
    const total = subtotal - discountAmount + tax;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        let customerId: string | undefined;
        let { data: existingCustomer } = await supabase.from("customers")
          .select("*").eq("name", customerData.name).maybeSingle();
        if (existingCustomer?.id) {
          customerId = existingCustomer.id;
        } else {
          const { data: createdCustomer } = await supabase
            .from("customers").insert({
              name: customerData.name,
              phone: customerData.phone,
              address: customerData.address,
              email: customerData.email,
            }).select("*").single();
          customerId = createdCustomer.id;
        }
        // --- Create invoice as before ---
        const { data: createdInvoice, error: invErr } = await supabase
          .from("invoices").insert({
            customer_id: customerId,
            total,
            status
          }).select("*").single();
        if (!createdInvoice || invErr) throw new Error(invErr?.message || "Failed to create invoice");

        // --- Now handle mapping product reference for both inventory and catalog entries ---
        for (let item of items) {
          const idToUse = item.product?.id;
          await supabase.from("invoice_items").insert({
            invoice_id: createdInvoice.id,
            product_id: idToUse,
            price: item.unitPrice,
            quantity: item.quantity
          });
        }
        toast({ title: "Success", description: "Invoice created!" });
        onClose();
        fetchInvoices();
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-5xl max-h-screen overflow-y-auto transition-colors">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Invoice</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Customer Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Customer Name" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" required />
                <input type="tel" placeholder="Phone Number" value={customerData.phone} onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" required />
                <input type="email" placeholder="Email (Optional)" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" />
                <input type="text" placeholder="Address" value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} className="w-full p-2 border rounded-lg md:col-span-2 dark:bg-slate-800 dark:border-gray-700 dark:text-white" required />
              </div>
            </div>
            {/* Items Section */}
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">Invoice Items</h4>
                <button type="button" onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
                  Add Item
                </button>
              </div>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg border dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        {/* -- USE ENHANCED PRODUCT SELECTOR: */}
                        <EnhancedProductSelector
                          onProductSelect={(product) => handleProductSelect(index, product)}
                          selectedProduct={item.product ?? undefined}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" min="1" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Unit Price</label>
                        <input type="number" placeholder="Price" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" min="0" step="0.01" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Total</label>
                        <div className="flex items-center p-2 bg-gray-100 dark:bg-slate-900 rounded-lg h-10">
                          <span className="text-sm font-medium dark:text-white">₹{item.total?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 p-2 rounded-lg h-10" disabled={items.length === 1}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Status, Totals, and Save/Cancel Buttons */}
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-44 p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Invoice Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (%)</label>
                  <input type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" min="0" max="100" step="0.1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Discount:</span><span>-₹{discountAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>GST (18%):</span><span>₹{tax.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Create Invoice</button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-100 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // --- Product modal for Manage Products tab ---
  const ManageProducts = () => {
    const [showProductForm, setShowProductForm] = useState(false);
    const [formProduct, setFormProduct] = useState<Partial<Product> | null>(null);
    const [formMode, setFormMode] = useState<"add" | "edit">("add");

    const openAdd = () => { setFormProduct({}); setFormMode("add"); setShowProductForm(true); };
    const openEdit = (product: Product) => { setFormProduct(product); setFormMode("edit"); setShowProductForm(true); };

    const handleSave = async () => {
      if (formMode === "add" && formProduct) {
        await addProduct(formProduct as any);
        toast({ title: "Product added" });
      } else if (formMode === "edit" && formProduct && formProduct.id) {
        await updateProduct({ id: formProduct.id, product: formProduct as any });
        toast({ title: "Product updated" });
      }
      setShowProductForm(false);
    };

    return (
      <div>
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h2>
          <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
            <Plus className="inline mr-1 h-5 w-5" /> Add Product
          </button>
        </div>
        {productsLoading ? (
          <div className="text-center text-gray-500 py-6">Loading products…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded bg-white dark:bg-slate-900">
              <thead>
                <tr>
                  <th className="px-2 py-1 border-b dark:border-gray-800">Name</th>
                  <th className="px-2 py-1 border-b dark:border-gray-800">Brand</th>
                  <th className="px-2 py-1 border-b dark:border-gray-800">Type</th>
                  <th className="px-2 py-1 border-b dark:border-gray-800">Price</th>
                  <th className="px-2 py-1 border-b dark:border-gray-800">Stock</th>
                  <th className="px-2 py-1 border-b dark:border-gray-800">Unit</th>
                  <th className="px-2 py-1 border-b dark:border-gray-800">Edit</th>
                  <th className="px-2 py-1 border-b dark:border-gray-800">Delete</th>
                </tr>
              </thead>
              <tbody>
                {(products ?? []).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100 dark:hover:bg-slate-800">
                    <td className="px-2 py-1">{product.name}</td>
                    <td className="px-2 py-1">{product.brand}</td>
                    <td className="px-2 py-1">{product.type}</td>
                    <td className="px-2 py-1">₹{Number(product.price).toFixed(2)}</td>
                    <td className="px-2 py-1">{product.stock}</td>
                    <td className="px-2 py-1">{product.unit}</td>
                    <td className="px-2 py-1">
                      <button className="text-green-600" onClick={() => openEdit(product)}>
                        <Edit className="inline h-5 w-5" />
                      </button>
                    </td>
                    <td className="px-2 py-1">
                      <button className="text-red-600" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="inline h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg mx-auto transition-colors">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{formMode === "add" ? "Add Product" : "Edit Product"}</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Name" value={formProduct?.name || ""} onChange={e => setFormProduct(p => ({ ...p, name: e.target.value }))} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" />
                <input type="text" placeholder="Brand" value={formProduct?.brand || ""} onChange={e => setFormProduct(p => ({ ...p, brand: e.target.value }))} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" />
                <input type="text" placeholder="Type" value={formProduct?.type || ""} onChange={e => setFormProduct(p => ({ ...p, type: e.target.value }))} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" />
                <input type="text" placeholder="Color" value={formProduct?.color || ""} onChange={e => setFormProduct(p => ({ ...p, color: e.target.value }))} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" />
                <input type="number" placeholder="Price" value={formProduct?.price || ""} onChange={e => setFormProduct(p => ({ ...p, price: Number(e.target.value) }))} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" />
                <input type="number" placeholder="Stock" value={formProduct?.stock || ""} onChange={e => setFormProduct(p => ({ ...p, stock: Number(e.target.value) }))} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" />
                <input type="text" placeholder="Unit" value={formProduct?.unit || ""} onChange={e => setFormProduct(p => ({ ...p, unit: e.target.value }))} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" />
                <button onClick={handleSave} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Save</button>
                <button onClick={() => setShowProductForm(false)} className="w-full bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-100 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- New: track editing and deleting invoice state ---
  const [editingInvoice, setEditingInvoice] = useState<null | Invoice>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<null | Invoice>(null);

  // --- MAIN RETURN ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="mr-3 h-8 w-8 text-green-600" />
                Professional Billing System
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Create GST compliant invoices with smart product lookup and professional PDF generation</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setShowCreateForm(true)} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Create Invoice
              </button>
              {/* Add Trade Receivables button here */}
              <TradeReceivablesDialog />
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
          <div className="flex space-x-4">
            <button onClick={() => setActiveTab('invoices')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'invoices' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>Invoices</button>
            <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'products' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>Manage Products</button>
            <button onClick={() => setActiveTab('regular_customers')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'regular_customers' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>Regular Customers</button>
          </div>
        </div>
        {/* Tabs content */}
        {activeTab === 'products' && <ManageProducts />}
        {activeTab === 'invoices' && (
          <>
            {/* Search */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600" />
              </div>
            </div>
            {/* Invoices List */}
            <div className="space-y-4">
              {filteredInvoices.map(invoice => (
                <div key={invoice.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow transition-colors">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{invoice.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          invoice.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                        }`}>
                          {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1)}
                        </span>
                        {/* Mark as paid button */}
                        {invoice.status !== 'paid' && (
                          <button onClick={() => {
                            editInvoice(invoice.id, { items: invoice.items ?? [], status: "paid", discount: 0, total: invoice.total });
                          }} className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 dark:hover:bg-green-800 text-xs">
                            Mark as Paid
                          </button>
                        )}
                        {/* Edit / Delete buttons */}
                        <button
                          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 text-xs"
                          onClick={() => setEditingInvoice(invoice)}
                        >
                          Edit
                        </button>
                        <button
                          className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                          onClick={() => setDeletingInvoice(invoice)}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div>
                          <p><strong>Customer:</strong> {invoice.customer?.name}</p>
                          <p><strong>Phone:</strong> {invoice.customer?.phone}</p>
                        </div>
                        <div>
                          <p><strong>Date:</strong> {invoice.created_at ? invoice.created_at.split("T")[0] : ""}</p>
                          <p><strong>Items:</strong> {invoice.items?.length || 0} product(s)</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{Number(invoice.total).toFixed(2)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Amount</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 p-2 rounded-lg">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDownloadPDF(invoice)} className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900 p-2 rounded-lg">
                          <DownloadIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Empty state */}
            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices found</h3>
                <p className="text-gray-600 dark:text-gray-300">Create your first invoice to get started</p>
              </div>
            )}
          </>
        )}
        {activeTab === 'regular_customers' && <RegularCustomersSection />}
      </div>
      {/* Create Invoice Modal */}
      {showCreateForm && (
        <CreateInvoiceForm onClose={() => setShowCreateForm(false)} />
      )}
      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <EditInvoiceForm
          invoice={editingInvoice}
          products={products ?? []}
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
