
import React, { useState } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import ProductSelector from "./ProductSelector";
import { toast } from "@/hooks/use-toast";
import type { Product, Invoice } from "@/hooks/useSupabaseInvoices";

export default function EditInvoiceForm({
  invoice,
  products,
  onSave,
  onCancel,
}: {
  invoice: Invoice;
  products: Product[];
  onSave: (newData: { items: any[]; status: string; discount: number; total: number }) => Promise<void>;
  onCancel: () => void;
}) {
  // Pre-load invoice items as editable array
  const [items, setItems] = useState<any[]>(invoice.items?.map((item) => ({
    product: products.find((p) => p.id === item.product_id),
    quantity: item.quantity,
    unitPrice: item.price,
    total: (item.quantity || 0) * (item.price || 0)
  })) ?? []);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState(invoice.status);

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
  const handleProductSelect = (idx: number, product: any) => {
    const arr = [...items];
    arr[idx] = {
      ...arr[idx],
      product,
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
      await onSave({
        items,
        status,
        discount: discountAmount,
        total,
      });
      toast({ title: "Success", description: "Invoice updated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-5xl max-h-screen overflow-y-auto transition-colors">
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Invoice</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                      <ProductSelector
                        onProductSelect={(product) => handleProductSelect(index, product)}
                        selectedProduct={item.product ?? undefined}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantity</label>
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" min="1" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit Price</label>
                      <input type="number" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white" min="0" step="0.01" required />
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
          {/* Status and Return Items */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white">
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  type="button" 
                  onClick={() => setItems([...items, { product: undefined, quantity: 1, unitPrice: 0, total: 0, isReturned: true, returnReason: '' }])}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Add Return Item
                </button>
              </div>
            </div>
          </div>
          {/* Totals */}
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
            <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Save Changes</button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-100 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
