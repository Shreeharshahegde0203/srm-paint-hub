
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
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
  product: {
    id: string;
    name: string;
    code: string;
    unit: string;
    gst_rate: number;
  };
  quantity: number;
  unit_price: number;
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
  const [step, setStep] = useState(1);
  
  // Customer Details
  const [customerType, setCustomerType] = useState<'walk-in' | 'regular'>('walk-in');
  const [customerName, setCustomerName] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [regularCustomers, setRegularCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Invoice Details
  const [billingMode, setBillingMode] = useState<'with_gst' | 'without_gst'>('with_gst');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  // Add Item Form
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerType === 'regular') {
      fetchRegularCustomers();
    }
  }, [customerType]);

  const fetchRegularCustomers = async () => {
    const { data, error } = await supabase
      .from('regular_customers')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setRegularCustomers(data.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone || undefined,
        email: customer.email || undefined,
        address: customer.address || undefined,
        gstin: customer.gstin || undefined,
      })));
    }
  };

  const filteredProducts = products?.filter(product =>
    product.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.code?.toLowerCase().includes(productSearch.toLowerCase())
  ) || [];

  const handleAddItem = () => {
    const product = products?.find(p => p.id === selectedProduct);
    if (!product || quantity <= 0) return;

    const unitPrice = customPrice || product.price;
    const itemTotal = quantity * unitPrice;

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      product: {
        id: product.id,
        name: product.name,
        code: product.code,
        unit: product.unit || 'Piece',
        gst_rate: product.gst_rate || 18,
      },
      quantity,
      unit_price: unitPrice,
      total: itemTotal,
    };

    setInvoiceItems(prev => [...prev, newItem]);
    
    // Reset form
    setSelectedProduct('');
    setProductSearch('');
    setQuantity(1);
    setCustomPrice(null);
    setShowAddItem(false);
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const gstAmount = billingMode === 'with_gst' 
      ? invoiceItems.reduce((sum, item) => sum + (item.total * item.product.gst_rate / 100), 0)
      : 0;
    const grandTotal = subtotal + gstAmount;
    
    return { subtotal, gstAmount, grandTotal };
  };

  const handleCreateInvoice = async () => {
    if (invoiceItems.length === 0) {
      toast({ title: "Error", description: "Please add at least one item", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { subtotal, gstAmount, grandTotal } = calculateTotals();
      
      // Create customer if walk-in
      let customerId = selectedCustomer?.id;
      if (customerType === 'walk-in') {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: customerName,
            phone: customerPhone || null,
            address: customerAddress || null,
            email: null,
          })
          .select('*')
          .single();
          
        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          customer_id: customerId,
          total: grandTotal,
          status: 'pending',
          billing_mode: billingMode,
        })
        .select('*')
        .single();
        
      if (invoiceError) throw invoiceError;

      // Create invoice items
      const invoiceItemsData = invoiceItems.map(item => ({
        invoice_id: invoice.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItemsData);
        
      if (itemsError) throw itemsError;

      // Update product stock
      for (const item of invoiceItems) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock: Math.max(0, (products?.find(p => p.id === item.product.id)?.stock || 0) - item.quantity)
          })
          .eq('id', item.product.id);
          
        if (stockError) throw stockError;
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

  const { subtotal, gstAmount, grandTotal } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Step 1: Customer Details</h3>
              
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setCustomerType('walk-in')}
                  className={`px-4 py-2 rounded-lg ${customerType === 'walk-in' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                >
                  Walk-in Customer
                </button>
                <button
                  onClick={() => setCustomerType('regular')}
                  className={`px-4 py-2 rounded-lg ${customerType === 'regular' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                >
                  Regular Customer
                </button>
              </div>

              {customerType === 'walk-in' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Customer Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Customer GSTIN (optional)</label>
                    <input
                      type="text"
                      value={customerGstin}
                      onChange={(e) => setCustomerGstin(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                      placeholder="29ABCDE1234F1Z2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Phone Number</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Address</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Select Regular Customer</label>
                  <select
                    value={selectedCustomer?.id || ''}
                    onChange={(e) => {
                      const customer = regularCustomers.find(c => c.id === e.target.value);
                      setSelectedCustomer(customer || null);
                    }}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    required
                  >
                    <option value="">Choose a customer</option>
                    {regularCustomers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.phone && `- ${customer.phone}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={customerType === 'walk-in' ? !customerName : !selectedCustomer}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Next: Add Items
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Step 2: Add Items</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setBillingMode(billingMode === 'with_gst' ? 'without_gst' : 'with_gst')}
                    className={`px-4 py-2 rounded-lg ${billingMode === 'with_gst' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-orange-600 text-white'}`}
                  >
                    {billingMode === 'with_gst' ? 'With GST' : 'Without GST'}
                  </button>
                </div>
              </div>

              {!showAddItem ? (
                <button
                  onClick={() => setShowAddItem(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </button>
              ) : (
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-4 text-gray-900 dark:text-white">Add New Item</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Item Name</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search products..."
                          className="w-full pl-10 p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        />
                      </div>
                      {productSearch && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {filteredProducts.map(product => (
                            <div
                              key={product.id}
                              onClick={() => {
                                setSelectedProduct(product.id);
                                setProductSearch(product.name);
                                setCustomPrice(product.price);
                              }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer border-b last:border-b-0 border-gray-200 dark:border-gray-600"
                            >
                              <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{product.code} - {product.unit} - ₹{product.price}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Unit Price (₹)</label>
                      <input
                        type="number"
                        value={customPrice || ''}
                        onChange={(e) => setCustomPrice(parseFloat(e.target.value) || null)}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <button
                        onClick={handleAddItem}
                        disabled={!selectedProduct || quantity <= 0}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddItem(false)}
                        className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice Items Table */}
              {invoiceItems.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                      <tr>
                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Description</th>
                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">Quantity</th>
                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">GST %</th>
                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-right">Rate/Unit (₹)</th>
                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-right">Amount (₹)</th>
                        <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                            <div className="font-medium text-gray-900 dark:text-white">{item.product.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.product.code}</div>
                          </td>
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">
                            {item.product.unit} × {item.quantity}
                          </td>
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">{item.product.gst_rate}%</td>
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-right">₹{item.unit_price.toFixed(2)}</td>
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-right font-medium">₹{item.total.toFixed(2)}</td>
                          <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-1 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals */}
              {invoiceItems.length > 0 && (
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="space-y-2 max-w-sm ml-auto">
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-gray-100">Subtotal:</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                    </div>
                    {billingMode === 'with_gst' && (
                      <div className="flex justify-between">
                        <span className="text-gray-900 dark:text-gray-100">GST:</span>
                        <span className="font-medium text-gray-900 dark:text-white">₹{gstAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2 border-gray-300 dark:border-gray-600">
                      <span className="text-gray-900 dark:text-white">Grand Total:</span>
                      <span className="text-green-600">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCreateInvoice}
                  disabled={invoiceItems.length === 0 || loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
