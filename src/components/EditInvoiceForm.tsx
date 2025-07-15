
import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, Plus, X } from "lucide-react";
import EnhancedProductSelector from "./EnhancedProductSelector";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

// Define the Invoice type locally to avoid circular imports
interface Invoice {
  id: string;
  status: string;
  billing_mode: string;
  total: number;
}

interface ReturnItemDialogProps {
  invoiceItems: any[];
  onReturn: (returnData: any) => void;
  onClose: () => void;
}

const ReturnItemDialog = ({ invoiceItems, onReturn, onClose }: ReturnItemDialogProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [returnReason, setReturnReason] = useState('');

  const handleReturn = () => {
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "Please select an item to return",
        variant: "destructive",
      });
      return;
    }

    if (returnQuantity <= 0 || returnQuantity > selectedItem.quantity) {
      toast({
        title: "Error",
        description: "Invalid return quantity",
        variant: "destructive",
      });
      return;
    }

    onReturn({
      product: selectedItem.product,
      quantity: returnQuantity,
      returnReason: returnReason || 'Customer return',
      originalQuantity: selectedItem.quantity
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold">Return Item</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Item to Return</label>
            <select
              value={selectedItem?.id || ''}
              onChange={(e) => {
                const item = invoiceItems.find(i => i.id === e.target.value);
                setSelectedItem(item);
                setReturnQuantity(1);
              }}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select an item...</option>
              {invoiceItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product.name} - Qty: {item.quantity} - ₹{item.unitPrice}
                </option>
              ))}
            </select>
          </div>

          {selectedItem && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Return Quantity</label>
                <input
                  type="number"
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(Math.max(1, Math.min(selectedItem.quantity, parseInt(e.target.value) || 1)))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  min="1"
                  max={selectedItem.quantity}
                />
                <p className="text-sm text-gray-500 mt-1">Max: {selectedItem.quantity}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Return Reason</label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter reason for return..."
                />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleReturn}
            disabled={!selectedItem}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Return Item
          </button>
        </div>
      </div>
    </div>
  );
};

interface AddItemDialogProps {
  onAddProduct: (product: Product, itemData: any) => void;
  onClose: () => void;
  billingMode?: string;
}

const AddItemDialog = ({ onAddProduct, onClose, billingMode }: AddItemDialogProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [colorCode, setColorCode] = useState('');
  const [base, setBase] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitQuantity, setUnitQuantity] = useState(1);
  const [unitType, setUnitType] = useState('Piece');
  const [gstPercentage, setGstPercentage] = useState(18);
  const [unitPrice, setUnitPrice] = useState(0);

  const unitTypes = ['Litre', 'Kg', 'Inch', 'Piece', 'Number', 'Meter', 'Square Feet'];

  useEffect(() => {
    if (selectedProduct) {
      setUnitPrice(selectedProduct.price);
      setGstPercentage(selectedProduct.gstRate || 18);
      setUnitType(selectedProduct.unit || 'Piece');
      setUnitQuantity(selectedProduct.unit_quantity || 1);
      setBase(selectedProduct.base || '');
    }
  }, [selectedProduct]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAdd = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    const itemData = {
      colorCode,
      base,
      quantity,
      unitQuantity,
      unitType,
      gstPercentage: billingMode === 'with_gst' ? gstPercentage : 0,
      unitPrice,
    };

    onAddProduct(selectedProduct, itemData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add Item to Invoice</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <EnhancedProductSelector
            onProductSelect={handleProductSelect}
            selectedProduct={selectedProduct}
          />
          
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Colour/Code</label>
                <input
                  type="text"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 input-focus"
                  placeholder="Enter colour or code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Base</label>
                <input 
                  type="number" 
                  value={base} 
                  onChange={(e) => setBase(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 input-focus"
                  placeholder="Enter base specification"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Unit Quantity</label>
                <input
                  type="number"
                  value={unitQuantity}
                  onChange={(e) => setUnitQuantity(parseFloat(e.target.value) || 1)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Unit Type</label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {unitTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {billingMode === 'with_gst' && (
                <div>
                  <label className="block text-sm font-medium mb-1">GST %</label>
                  <input
                    type="number"
                    value={gstPercentage}
                    onChange={(e) => setGstPercentage(parseInt(e.target.value) || 18)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    min="0"
                    max="28"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Unit Price</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!selectedProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditInvoiceForm({
  invoice,
  products,
  onSave,
  onCancel,
}: {
  invoice: any;
  products: Product[];
  onSave: (newData: { items: any[]; status: string; discount: number; total: number }) => Promise<void>;
  onCancel: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [returnedItems, setReturnedItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState(invoice.status);
  const [partialAmount, setPartialAmount] = useState((invoice as any).partial_amount_paid || 0);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [billType, setBillType] = useState(invoice.billing_mode || 'with_gst');
  const [gstInclusive, setGstInclusive] = useState(true); // Default to GST-inclusive
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    // Load invoice items and customer data
    const loadInvoiceData = async () => {
      try {
        const { data: invoiceItems } = await supabase
          .from("invoice_items")
          .select("*")
          .eq("invoice_id", invoice.id);

        const { data: customerData } = await supabase
          .from("customers")
          .select("*")
          .eq("id", invoice.customer_id)
          .single();

          const mappedItems = (invoiceItems || []).map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return {
            id: item.id,
            product,
            quantity: item.quantity,
            unitPrice: item.price,
            total: item.quantity * item.price,
            colorCode: item.color_code || '',
            base: item.base || product?.base || '',
            unitQuantity: item.unit_quantity || product?.unit_quantity || 1,
            unitType: item.unit_type || product?.unit || 'Piece',
            gstPercentage: item.gst_percentage || 18,
            isReturned: false
          };
        });

        setItems(mappedItems);
        setCustomer(customerData);
      } catch (error) {
        console.error('Error loading invoice data:', error);
      }
    };

    loadInvoiceData();
  }, [invoice.id, products]);

  const addItem = () => setShowAddItem(true);
  
  const handleAddProduct = (product: Product, itemData: any) => {
    const newItem = {
      id: Date.now().toString(),
      product,
      quantity: itemData.quantity,
      unitPrice: itemData.unitPrice,
      total: itemData.quantity * itemData.unitPrice,
      colorCode: itemData.colorCode,
      base: itemData.base || product.base || '',
      unitQuantity: itemData.unitQuantity || product.unit_quantity || 1,
      unitType: itemData.unitType || product.unit || 'Piece',
      gstPercentage: itemData.gstPercentage,
      isReturned: false,
      isNew: true
    };
    setItems([...items, newItem]);
    setShowAddItem(false);
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const arr = [...items];
    arr[idx] = { ...arr[idx], [field]: value };
    if (['quantity', 'unitPrice'].includes(field)) {
      const quantity = field === 'quantity' ? value : arr[idx].quantity || 0;
      const unitPrice = field === 'unitPrice' ? value : arr[idx].unitPrice || 0;
      arr[idx].total = quantity * unitPrice;
    }
    // Always ensure unitQuantity and unitType are set
    if (!arr[idx].unitQuantity) arr[idx].unitQuantity = arr[idx].product?.unit_quantity || 1;
    if (!arr[idx].unitType) arr[idx].unitType = arr[idx].product?.unit || 'Piece';
    setItems(arr);
  };

  const removeItem = (idx: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== idx));
  };

  const handleReturnItem = async (returnData: any) => {
    const newReturnedItem = {
      ...returnData,
      total: -(returnData.quantity * returnData.product.price),
      id: Date.now().toString()
    };
    setReturnedItems([...returnedItems, newReturnedItem]);

    // Update product stock immediately
    try {
      await supabase
        .from("products")
        .update({ 
          stock: returnData.product.stock + returnData.quantity 
        })
        .eq("id", returnData.product.id);

      toast({
        title: "Return Processed",
        description: `${returnData.quantity} units of ${returnData.product.name} returned`,
      });
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const removeReturnedItem = (idx: number) => {
    setReturnedItems(returnedItems.filter((_, i) => i !== idx));
  };

  // Calculation logic
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const returnTotal = returnedItems.reduce((sum, item) => sum + Math.abs(item.total || 0), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - returnTotal - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const allItems = [...items, ...returnedItems];
      await onSave({
        items: allItems,
        status,
        discount: discountAmount,
        total,
        partialAmount: status === 'partially_paid' ? partialAmount : 0
      } as any);
      toast({ title: "Success", description: "Invoice updated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-6xl max-h-screen overflow-y-auto transition-all duration-300 scale-in card-hover">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white animate-slide-in-left">Edit Invoice</h3>
          {customer && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 animate-fade-in bounce-on-hover" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-semibold">Customer:</span> {customer.name}
                {customer.phone && <span className="ml-2">• {customer.phone}</span>}
              </p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bill Type Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Bill Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="with_gst"
                  checked={billType === 'with_gst'}
                  onChange={() => setBillType('with_gst')}
                  className="mr-2"
                />
                GST Bill
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="without_gst"
                  checked={billType === 'without_gst'}
                  onChange={() => setBillType('without_gst')}
                  className="mr-2"
                />
                Non-GST Bill
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="casual"
                  checked={billType === 'casual'}
                  onChange={() => setBillType('casual')}
                  className="mr-2"
                />
                Casual Bill
              </label>
            </div>
          </div>
          {/* GST Inclusive/Exclusive Toggle (only for GST Bill) */}
          {billType === 'with_gst' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Unit Price is</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="inclusive"
                    checked={gstInclusive}
                    onChange={() => setGstInclusive(true)}
                    className="mr-2"
                  />
                  GST Inclusive
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="exclusive"
                    checked={!gstInclusive}
                    onChange={() => setGstInclusive(false)}
                    className="mr-2"
                  />
                  GST Exclusive
                </label>
              </div>
            </div>
          )}
          
          {/* Items Section */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">Invoice Items</h4>
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowReturnDialog(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Return Item
                </button>
                <button 
                  type="button" 
                  onClick={addItem} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id || index} className="bg-white dark:bg-slate-800 p-4 rounded-lg border dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-9 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-reveal">Product</label>
                      <div className="p-2 bg-gray-100 dark:bg-slate-900 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors duration-200">
                        <span className="text-sm font-medium">{item.product?.name || 'Unknown Product'}</span>
                        {item.product?.brand && (
                          <p className="text-xs text-gray-500">{item.product.brand} • {item.product.type}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Color/Code</label>
                      <input 
                        type="text" 
                        value={item.colorCode || ''} 
                        onChange={(e) => updateItem(index, 'colorCode', e.target.value)} 
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white input-focus hover:shadow-md transition-all duration-200" 
                        placeholder="Color/Code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Base</label>
                      <input 
                        type="number" 
                        value={item.base || ''} 
                        onChange={(e) => updateItem(index, 'base', e.target.value)} 
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white input-focus hover:shadow-md transition-all duration-200" 
                        placeholder="Base"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit Quantity</label>
                      <input 
                        type="number" 
                        value={item.unitQuantity || 1} 
                        onChange={(e) => updateItem(index, 'unitQuantity', parseFloat(e.target.value) || 1)} 
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white input-focus hover:shadow-md transition-all duration-200" 
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantity</label>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)} 
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white input-focus hover:shadow-md transition-all duration-200" 
                        min="1" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Unit Price</label>
                      <input 
                        type="number" 
                        value={item.unitPrice} 
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)} 
                        className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white input-focus hover:shadow-md transition-all duration-200" 
                        min="0" 
                        step="0.01" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Total</label>
                      <div className="flex items-center p-2 bg-gray-100 dark:bg-slate-900 rounded-lg h-10 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors duration-200">
                        <span className="text-sm font-medium dark:text-white">₹{item.total?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)} 
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 p-2 rounded-lg h-10 wobble-on-hover transition-all duration-200" 
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

          {/* Returned Items Section */}
          {returnedItems.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4">Returned Items</h4>
              <div className="space-y-2">
                {returnedItems.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 p-3 rounded border flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        Qty: {item.quantity} | Reason: {item.returnReason}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-medium">-₹{Math.abs(item.total).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => removeReturnedItem(index)}
                        className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status and Totals */}
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)} 
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                {/* Discount Field */}
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={e => setDiscount(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-700 dark:text-white"
                    placeholder="Enter discount percentage"
                  />
                </div>
                {/* Partial Payment Amount */}
                {status === 'partially_paid' && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Amount Paid <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={total}
                      value={partialAmount}
                      onChange={(e) => setPartialAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter amount paid"
                    />
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>Total Bill: ₹{total.toFixed(2)}</p>
                      <p>Amount Paid: ₹{partialAmount.toFixed(2)}</p>
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        Remaining: ₹{(total - partialAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                {returnedItems.length > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Returns:</span><span>-₹{returnTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between"><span>Discount:</span><span>-₹{discountAmount.toFixed(2)}</span></div>
                {/* GST removed from summary */}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
              Save Changes
            </button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-100 py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600">
              Cancel
            </button>
          </div>
        </form>

        {/* Add Item Dialog */}
        {showAddItem && (
          <AddItemDialog
            onAddProduct={handleAddProduct}
            onClose={() => setShowAddItem(false)}
            billingMode={invoice.billing_mode}
          />
        )}

        {/* Return Item Dialog */}
        {showReturnDialog && (
          <ReturnItemDialog
            invoiceItems={items}
            onReturn={handleReturnItem}
            onClose={() => setShowReturnDialog(false)}
          />
        )}
      </div>
    </div>
  );
}
