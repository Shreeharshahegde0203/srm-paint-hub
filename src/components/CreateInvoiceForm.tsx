import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { Product, InvoiceItem, isValidQuantity } from '../data/products';
import ProductSelector from './ProductSelector';
import InvoiceItemRow from './InvoiceItemRow';
import { toast } from "@/hooks/use-toast";

interface CreateInvoiceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateInvoiceForm = ({ onClose, onSuccess }: CreateInvoiceFormProps) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGSTIN, setCustomerGSTIN] = useState('');
  const [billType, setBillType] = useState<'gst' | 'non_gst' | 'casual'>('gst');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [colorCode, setColorCode] = useState('');
  const [base, setBase] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) {
        toast({ title: "Error fetching customers", description: error.message, variant: "destructive" });
      } else {
        setCustomers(data || []);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast({ title: "Please select a product", variant: "destructive" });
      return;
    }

    if (!isValidQuantity(quantity)) {
      toast({ title: "Quantity must be whole numbers or 0.5 only", variant: "destructive" });
      return;
    }

    if (billType !== 'casual' && unitPrice <= 0) {
      toast({ title: "Please enter a valid unit price", variant: "destructive" });
      return;
    }

    const newItem: InvoiceItem = {
      id: `temp-${Date.now()}`,
      product: selectedProduct,
      quantity,
      unitPrice: billType === 'casual' ? 0 : unitPrice,
      total: billType === 'casual' ? 0 : quantity * unitPrice,
      colorCode: colorCode || undefined,
      base: base || selectedProduct.base,
      isReturned: false
    };

    setItems([...items, newItem]);
    setSelectedProduct(null);
    setQuantity(1);
    setUnitPrice(0);
    setColorCode('');
    setBase('');
  };

  const handleUpdateItem = (index: number, updates: Partial<InvoiceItem>) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], ...updates };
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleReturnItem = (index: number, reason?: string) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      isReturned: true,
      returnReason: reason
    };
    setItems(updatedItems);
  };

  const subtotal = items.reduce((sum, item) => 
    sum + (item.isReturned ? -item.total : item.total), 0
  );
  const gstAmount = billType === 'gst' ? subtotal * 0.18 : 0;
  const total = subtotal + gstAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: "Please add at least one item", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Create customer if new
      let customerId = selectedCustomer;
      if (!customerId && customerName) {
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            email: customerGSTIN ? `${customerGSTIN}@gstin.placeholder` : undefined
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = customer.id;
      }

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          customer_id: customerId,
          total,
          bill_type: billType,
          billing_mode: billType === 'gst' ? 'with_gst' : 'without_gst',
          status: 'completed'
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      const itemsData = items.map(item => ({
        invoice_id: invoice.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.unitPrice,
        color_code: item.colorCode,
        base: item.base
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsData);

      if (itemsError) throw itemsError;

      // Create returned items records
      const returnedItems = items.filter(item => item.isReturned);
      if (returnedItems.length > 0) {
        const returnedItemsData = returnedItems.map(item => ({
          invoice_id: invoice.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          return_reason: item.returnReason
        }));

        const { error: returnError } = await supabase
          .from('invoice_returned_items')
          .insert(returnedItemsData);

        if (returnError) throw returnError;
      }

      toast({ title: "Invoice created successfully!" });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({ title: "Error creating invoice", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Customer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            {billType === 'gst' && (
              <div>
                <label className="block text-sm font-medium mb-1">GSTIN</label>
                <input
                  type="text"
                  value={customerGSTIN}
                  onChange={(e) => setCustomerGSTIN(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Bill Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Bill Type</label>
            <div className="flex space-x-4">
              {(['gst', 'non_gst', 'casual'] as const).map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    value={type}
                    checked={billType === type}
                    onChange={(e) => setBillType(e.target.value as any)}
                    className="mr-2"
                  />
                  {type === 'gst' ? 'GST Bill' : type === 'non_gst' ? 'Non-GST Bill' : 'Casual Bill'}
                </label>
              ))}
            </div>
          </div>

          {/* Add Item Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">Add Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <ProductSelector
                  onProductSelect={setSelectedProduct}
                  selectedProduct={selectedProduct}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Base (Optional)</label>
                <input
                  type="text"
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color Code</label>
                <input
                  type="text"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Color"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0.5"
                />
              </div>
              {billType !== 'casual' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>

          {/* Items Table */}
          {items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Base</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Color</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Unit</th>
                      {billType !== 'casual' && (
                        <th className="border border-gray-300 px-4 py-2 text-right">
                          {billType === 'gst' ? 'Price (Ex-GST)' : 'Unit Price'}
                        </th>
                      )}
                      {billType !== 'casual' && (
                        <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                      )}
                      <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <InvoiceItemRow
                        key={index}
                        item={item}
                        index={index}
                        onUpdateItem={handleUpdateItem}
                        onRemoveItem={handleRemoveItem}
                        onReturnItem={handleReturnItem}
                        billType={billType}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              {billType !== 'casual' && (
                <div className="mt-4 text-right">
                  <p className="text-lg">Subtotal: ₹{subtotal.toFixed(2)}</p>
                  {billType === 'gst' && (
                    <p className="text-lg">GST (18%): ₹{gstAmount.toFixed(2)}</p>
                  )}
                  <p className="text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceForm;
