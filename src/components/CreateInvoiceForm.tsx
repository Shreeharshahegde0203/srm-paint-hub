import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search, Calendar } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  gstin?: string;
}

interface InvoiceItem {
  id: string;
  productCode: string;
  itemName: string;
  perUnit: number;
  units: string;
  gstPercent: number;
  amountPerUnit: number;
  quantity: number;
  total: number;
}

interface CreateInvoiceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const { products } = useSupabaseProducts();
  
  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceStatus, setInvoiceStatus] = useState('pending');
  
  // Add Items Form
  const [productCode, setProductCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [perUnit, setPerUnit] = useState(1);
  const [units, setUnits] = useState('liter');
  const [gstPercent, setGstPercent] = useState(18);
  const [amountPerUnit, setAmountPerUnit] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Invoice Items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const filteredProducts = products?.filter(product =>
    product.name?.toLowerCase().includes(itemName.toLowerCase()) ||
    product.code?.toLowerCase().includes(productCode.toLowerCase())
  ) || [];

  const handleProductSelect = (product: any) => {
    setProductCode(product.code);
    setItemName(product.name);
    setAmountPerUnit(product.price);
    setGstPercent(product.gst_rate || 18);
    setUnits(product.unit || 'liter');
    setShowProductDropdown(false);
  };

  const handleAddItem = () => {
    if (!productCode || !itemName || perUnit <= 0 || amountPerUnit <= 0 || quantity <= 0) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const total = quantity * amountPerUnit;

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productCode,
      itemName,
      perUnit,
      units,
      gstPercent,
      amountPerUnit,
      quantity,
      total,
    };

    setInvoiceItems(prev => [...prev, newItem]);
    
    // Reset form
    setProductCode('');
    setItemName('');
    setPerUnit(1);
    setUnits('liter');
    setGstPercent(18);
    setAmountPerUnit(0);
    setQuantity(1);
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateGrandTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCreateInvoice = async () => {
    if (!customerName || invoiceItems.length === 0) {
      toast({ title: "Error", description: "Please add customer name and at least one item", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Create customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customerName,
          phone: null,
          address: null,
          email: null,
        })
        .select('*')
        .single();
        
      if (customerError) throw customerError;

      // Create invoice
      const grandTotal = calculateGrandTotal();
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          customer_id: newCustomer.id,
          total: grandTotal,
          status: invoiceStatus,
          billing_mode: 'with_gst',
        })
        .select('*')
        .single();
        
      if (invoiceError) throw invoiceError;

      // Create invoice items
      for (const item of invoiceItems) {
        const product = products?.find(p => p.code === item.productCode);
        if (product) {
          const { error: itemsError } = await supabase
            .from('invoice_items')
            .insert({
              invoice_id: invoice.id,
              product_id: product.id,
              quantity: item.quantity,
              price: item.amountPerUnit,
            });
            
          if (itemsError) throw itemsError;
        }
      }

      toast({ title: "Invoice Created Successfully!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-6xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Customer Details Section */}
          <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Customer GSTIN (Optional)</label>
                <input
                  type="text"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  placeholder="Enter GSTIN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Invoice Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Status</label>
                <select
                  value={invoiceStatus}
                  onChange={(e) => setInvoiceStatus(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Items Section */}
          <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add Items</h3>
            
            {/* Product Code and Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Product Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={productCode}
                    onChange={(e) => {
                      setProductCode(e.target.value);
                      setShowProductDropdown(e.target.value.length > 0);
                    }}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    placeholder="Search or enter product code"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => {
                      setItemName(e.target.value);
                      setShowProductDropdown(e.target.value.length > 0);
                    }}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    placeholder="Search or enter name"
                  />
                  {showProductDropdown && filteredProducts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredProducts.map(product => (
                        <div
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer border-b last:border-b-0 border-gray-200 dark:border-gray-600"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">{product.code} - {product.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{product.brand} - ₹{product.price}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity, Per Unit, Units, GST %, Amount Per Unit Fields */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Per Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={perUnit}
                  onChange={(e) => setPerUnit(parseFloat(e.target.value) || 1)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Units <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  placeholder="liter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  GST % <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={gstPercent}
                  onChange={(e) => setGstPercent(parseFloat(e.target.value) || 18)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Amount Per Unit (Incl. GST) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={amountPerUnit}
                  onChange={(e) => setAmountPerUnit(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <button
              onClick={handleAddItem}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-medium"
            >
              Add Item
            </button>
          </div>

          {/* Invoice Items Table */}
          {invoiceItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-700 dark:text-gray-300">Product Code</th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-700 dark:text-gray-300">Description</th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-700 dark:text-gray-300">Quantity</th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-700 dark:text-gray-300">GST %</th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-700 dark:text-gray-300">Rate/Unit (₹)</th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-gray-700 dark:text-gray-300">Amount (₹)</th>
                      <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-gray-700 dark:text-gray-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white font-mono">{item.productCode}</td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white">{item.itemName}</td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white">
                          {item.quantity} × {item.perUnit} {item.units}
                        </td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white">{item.gstPercent}%</td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white">₹{item.amountPerUnit.toFixed(2)}</td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white font-medium">₹{item.total.toFixed(2)}</td>
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grand Total */}
              <div className="mt-4 text-right">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  Grand Total: ₹{calculateGrandTotal().toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateInvoice}
              disabled={invoiceItems.length === 0 || loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};