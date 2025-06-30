
import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import EnhancedProductSelector from "./EnhancedProductSelector";
import type { Tables } from "@/integrations/supabase/types";

type Customer = Tables<"customers">;

interface CreateInvoiceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const { products } = useSupabaseProducts();
  const [billingType, setBillingType] = useState<"with_gst" | "without_gst">("with_gst");
  const [customerData, setCustomerData] = useState<Partial<Customer>>({
    name: "", phone: "", address: "", email: ""
  });
  const [items, setItems] = useState<any[]>([
    { product: undefined, quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState("pending");

  const addItem = () => {
    setItems([...items, { product: undefined, quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const arr = [...items];
    arr[idx] = { ...arr[idx], [field]: value };
    if (["quantity", "unitPrice"].includes(field)) {
      const quantity = field === "quantity" ? value : arr[idx].quantity || 0;
      const unitPrice = field === "unitPrice" ? value : arr[idx].unitPrice || 0;
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
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = billingType === "with_gst" ? taxableAmount * 0.18 : 0;
  const total = taxableAmount + gstAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create or find customer
      let customerId: string;
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("*")
        .eq("name", customerData.name)
        .maybeSingle();

      if (existingCustomer?.id) {
        customerId = existingCustomer.id;
      } else {
        const { data: createdCustomer } = await supabase
          .from("customers")
          .insert({
            name: customerData.name,
            phone: customerData.phone,
            address: customerData.address,
            email: customerData.email,
          })
          .select("*")
          .single();
        customerId = createdCustomer!.id;
      }

      // Create invoice
      const { data: createdInvoice } = await supabase
        .from("invoices")
        .insert({
          customer_id: customerId,
          total,
          status,
          billing_mode: billingType,
        })
        .select("*")
        .single();

      // Add invoice items
      for (const item of items) {
        await supabase.from("invoice_items").insert({
          invoice_id: createdInvoice!.id,
          product_id: item.product?.id,
          price: item.unitPrice,
          quantity: item.quantity,
        });
      }

      toast({ title: "Success", description: "Invoice created successfully!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create invoice",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-6xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Billing Type Selection */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Billing Type</h4>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="with_gst"
                  checked={billingType === "with_gst"}
                  onChange={(e) => setBillingType(e.target.value as "with_gst")}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">With GST</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="without_gst"
                  checked={billingType === "without_gst"}
                  onChange={(e) => setBillingType(e.target.value as "without_gst")}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">Without GST</span>
              </label>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Customer Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name *"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
              />
              <textarea
                placeholder="Address"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
                rows={2}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">Invoice Items</h4>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Product</label>
                      <EnhancedProductSelector
                        onProductSelect={(product) => handleProductSelect(index, product)}
                        selectedProduct={item.product}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit</label>
                      <div className="p-2 bg-gray-100 dark:bg-slate-900 rounded-lg">
                        <span className="text-sm">{item.product?.unit || "Unit"}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rate</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount</label>
                      <div className="p-2 bg-gray-100 dark:bg-slate-900 rounded-lg">
                        <span className="text-sm font-medium">₹{item.total?.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 p-2 rounded-lg"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">Invoice Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Amount:</span>
                  <span>₹{taxableAmount.toFixed(2)}</span>
                </div>
                {billingType === "with_gst" && (
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-44 p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Create Invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
