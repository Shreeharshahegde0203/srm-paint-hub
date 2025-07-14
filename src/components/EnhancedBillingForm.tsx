
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Search, ShoppingCart, Edit3, Trash2, RotateCcw } from 'lucide-react';
import { Product, isValidQuantity, UNIT_TYPES } from '../data/products';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import ReturnItemDialog from './ReturnItemDialog';

interface BillingItem {
  id: string;
  product: Product;
  quantity: number;
  unitQuantity: number;
  quantityType: string;
  unitPrice: number;
  // priceExcludingGst removed
  gstPercentage: number;
  colorCode?: string;
  base?: string;
  total: number;
  isReturned?: boolean;
  returnReason?: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  gstin: string;
}

interface BillingFormProps {
  onClose: () => void;
  onSave: (billData: any) => void;
  existingBill?: any;
  isEditing?: boolean;
}

type BillType = 'gst' | 'non_gst' | 'casual';

const EnhancedBillingForm = ({ onClose, onSave, existingBill, isEditing = false }: BillingFormProps) => {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    gstin: ''
  });
  
  const [items, setItems] = useState<BillingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [billType, setBillType] = useState<BillType>('gst');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'partially_paid'>('pending');
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  
  // Current item being added
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentBase, setCurrentBase] = useState('');
  const [currentColorCode, setCurrentColorCode] = useState('');
  const [currentUnitQuantity, setCurrentUnitQuantity] = useState(1);
  const [currentQuantityType, setCurrentQuantityType] = useState('Litre');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [currentGstPercentage, setCurrentGstPercentage] = useState(18);
  const [currentUnitPrice, setCurrentUnitPrice] = useState(0);
  
  const { products, isLoading } = useSupabaseProducts();

  // Search products
  useEffect(() => {
    if (searchTerm && products) {
      const mappedProducts: Product[] = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        type: p.type,
        base: p.base || '',
        price: p.price,
        stock: p.stock,
        gstRate: p.gst_rate || 18,
        unit: p.unit || 'Piece',
        description: p.description,
        hsn_code: p.hsn_code,
        unit_quantity: p.unit_quantity || 1
      }));

      const filtered = mappedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.base && product.base.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setSearchResults(filtered.slice(0, 10));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, products]);

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentBase(product.base || '');
    setCurrentGstPercentage(product.gstRate || 18);
    setCurrentUnitPrice(product.price);
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  const addItem = () => {
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    if (!customer.name.trim()) {
      alert('Customer name is required');
      return;
    }

    if (!isValidQuantity(currentQuantity)) {
      alert('Quantity must be whole numbers or 0.5 only');
      return;
    }

    const total = currentQuantity * currentUnitPrice;

    const newItem: BillingItem = {
      id: Date.now().toString(),
      product: selectedProduct,
      quantity: currentQuantity,
      unitQuantity: currentUnitQuantity,
      quantityType: currentQuantityType,
      unitPrice: currentUnitPrice,
      // priceExcludingGst removed
      gstPercentage: currentGstPercentage,
      colorCode: currentColorCode,
      base: currentBase,
      total,
      isReturned: false
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Reset form
    setSelectedProduct(null);
    setCurrentBase('');
    setCurrentColorCode('');
    setCurrentUnitQuantity(1);
    setCurrentQuantityType('Litre');
    setCurrentQuantity(1);
    setCurrentGstPercentage(18);
    setCurrentUnitPrice(0);
  };

  const updateItem = (itemId: string, updates: Partial<BillingItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, ...updates };
        if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
          const quantity = updates.quantity !== undefined ? updates.quantity : item.quantity;
          const unitPrice = updates.unitPrice !== undefined ? updates.unitPrice : item.unitPrice;
          updated.total = quantity * unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const adjustQuantity = (value: number, increment: boolean) => {
    const newValue = increment ? value + 0.5 : Math.max(0.5, value - 0.5);
    return isValidQuantity(newValue) ? newValue : value;
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.isReturned ? -item.total : item.total), 0);
    // GST amount is not calculated separately anymore
    const gstAmount = 0;
    const total = subtotal;
    return { subtotal, gstAmount, total };
  };

  const handleSave = () => {
    if (!customer.name.trim()) {
      alert('Customer name is required');
      return;
    }
    
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    // Remove validation for casual bills - allow both pending and paid

    const { subtotal, gstAmount, total } = calculateTotals();
    
    const billData = {
      customer,
      items,
      subtotal,
      gstAmount,
      total,
      billType,
      paymentStatus,
      partialAmount: paymentStatus === 'partially_paid' ? partialAmount : 0,
      createdAt: new Date().toISOString()
    };
    
    onSave(billData);
  };

  const { subtotal, gstAmount, total } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📄 Create New Bill
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bill Type Selection */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📋 Bill Type</h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="gst"
                  checked={billType === 'gst'}
                  onChange={(e) => setBillType(e.target.value as BillType)}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">GST Bill</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="non_gst"
                  checked={billType === 'non_gst'}
                  onChange={(e) => setBillType(e.target.value as BillType)}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">Non-GST Bill</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="casual"
                  checked={billType === 'casual'}
                  onChange={(e) => setBillType(e.target.value as BillType)}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">Casual Bill</span>
              </label>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">👤 Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  value={customer.address}
                  onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  GSTIN Number
                </label>
                <input
                  type="text"
                  value={customer.gstin}
                  onChange={(e) => setCustomer(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter GSTIN number"
                  maxLength={15}
                />
              </div>
            </div>
          </div>

          {/* Product Search and Selection */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🔍 Add Products</h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Search products by name, brand, or base..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg dark:bg-gray-700 dark:text-white"
              />
              
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto mt-2">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => selectProduct(product)}
                      className="p-4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">
                            {product.name}{product.base ? ` - ${product.base}` : ''}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">{product.brand} • {product.type}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock} {product.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600 text-xl">₹{product.price}</p>
                          <p className="text-sm text-gray-500">per {product.unit}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Form */}
            {selectedProduct && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Selected: {selectedProduct.name}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Base</label>
                    <input
                      type="number"
                      value={currentBase}
                      onChange={(e) => setCurrentBase(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      placeholder="Base"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Color/Code</label>
                    <input
                      type="text"
                      value={currentColorCode}
                      onChange={(e) => setCurrentColorCode(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      placeholder="Color code"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Unit Quantity</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setCurrentUnitQuantity(adjustQuantity(currentUnitQuantity, false))}
                        className="p-1 border rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-500"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        step="0.5"
                        value={currentUnitQuantity}
                        onChange={(e) => setCurrentUnitQuantity(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border-t border-b text-center dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setCurrentUnitQuantity(adjustQuantity(currentUnitQuantity, true))}
                        className="p-1 border rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-500"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Quantity Type</label>
                    <select
                      value={currentQuantityType}
                      onChange={(e) => setCurrentQuantityType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    >
                      {UNIT_TYPES.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Quantity</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setCurrentQuantity(adjustQuantity(currentQuantity, false))}
                        className="p-1 border rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-500"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        step="0.5"
                        value={currentQuantity}
                        onChange={(e) => setCurrentQuantity(parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border-t border-b text-center dark:bg-gray-600 dark:text-white dark:border-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setCurrentQuantity(adjustQuantity(currentQuantity, true))}
                        className="p-1 border rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-500"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                   {/* GST % field should only show for GST bills */}
                   {billType === 'gst' && (
                     <div>
                       <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">GST %</label>
                       <div className="flex items-center">
                         <button
                           type="button"
                           onClick={() => setCurrentGstPercentage(Math.max(0, currentGstPercentage - 1))}
                           className="p-1 border rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-500"
                         >
                           <Minus className="h-4 w-4" />
                         </button>
                         <input
                           type="number"
                           value={currentGstPercentage}
                           onChange={(e) => setCurrentGstPercentage(parseInt(e.target.value) || 0)}
                           className="w-16 px-2 py-1 border-t border-b text-center dark:bg-gray-600 dark:text-white dark:border-gray-500"
                         />
                         <button
                           type="button"
                           onClick={() => setCurrentGstPercentage(currentGstPercentage + 1)}
                           className="p-1 border rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-500"
                         >
                           <Plus className="h-4 w-4" />
                         </button>
                       </div>
                     </div>
                   )}
                  
                   {billType !== 'casual' && (
                     <div>
                       <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Unit Price (including GST)</label>
                       <div className="flex items-center">
                         <button
                           type="button"
                           onClick={() => setCurrentUnitPrice(Math.max(0, currentUnitPrice - 10))}
                           className="p-1 border rounded-l hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-500"
                         >
                           <Minus className="h-4 w-4" />
                         </button>
                         <input
                           type="number"
                           step="0.01"
                           value={currentUnitPrice}
                           onChange={(e) => setCurrentUnitPrice(parseFloat(e.target.value) || 0)}
                           className="w-20 px-2 py-1 border-t border-b text-center dark:bg-gray-600 dark:text-white dark:border-gray-500"
                         />
                         <button
                           type="button"
                           onClick={() => setCurrentUnitPrice(currentUnitPrice + 10)}
                           className="p-1 border rounded-r hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-500"
                         >
                           <Plus className="h-4 w-4" />
                         </button>
                       </div>
                     </div>
                   )}
                </div>
                
                <button
                  onClick={addItem}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>
            )}
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-4">
                <h3 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
                  <ShoppingCart className="mr-3 h-6 w-6 text-green-600" />
                  Bill Items ({items.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Product</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Color/Code</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Qty</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Unit</th>
                       {billType === 'gst' && <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">GST%</th>}
                       {/* Removed Price (Ex-GST) column */}
                       {billType !== 'casual' && <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Total</th>}
                      <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{item.product.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.product.brand} • {item.base || 'No Base'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-900 dark:text-white">{item.colorCode || '-'}</td>
                        <td className="px-4 py-3 text-center text-gray-900 dark:text-white font-medium">{item.quantity}</td>
                        <td className="px-4 py-3 text-center text-gray-900 dark:text-white">{item.quantityType}</td>
                         {billType === 'gst' && <td className="px-4 py-3 text-center text-gray-900 dark:text-white font-medium">{item.gstPercentage}%</td>}
                         {/* Removed Price (Ex-GST) cell */}
                         {billType !== 'casual' && <td className="px-4 py-3 text-center font-bold text-lg text-green-600">₹{item.total.toFixed(2)}</td>}
                        <td className="px-4 py-3">
                           <div className="flex items-center justify-center space-x-2">
                             <button
                               onClick={() => removeItem(item.id)}
                               className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded dark:hover:bg-red-900"
                               title="Remove"
                             >
                               <Trash2 className="h-4 w-4" />
                             </button>
                             <button
                               onClick={() => setShowReturnDialog(true)}
                               className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded dark:hover:bg-orange-900"
                               title="Return Item"
                             >
                               <RotateCcw className="h-4 w-4" />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">💰 Payment Status</h3>
            
            <div className="flex flex-wrap gap-4 mb-4">
              {(['paid', 'pending', 'partially_paid'] as const).map(status => (
                <label key={status} className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    value={status}
                    checked={paymentStatus === status}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {status.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
            
            {/* Partial Payment Amount */}
            {paymentStatus === 'partially_paid' && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
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

          {/* Totals */}
          {items.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
              <div className="flex justify-end">
                <div className="w-96 space-y-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                   {/* GST amount removed from summary */}
                  <div className="flex justify-between font-bold text-xl border-t pt-3 text-green-600">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg"
            >
              💾 Save Bill
            </button>
          </div>
        </div>
      </div>

      {/* Return Item Dialog */}
      {showReturnDialog && (
        <ReturnItemDialog
          onReturn={(returnData) => {
            const returnItem: BillingItem = {
              id: Date.now().toString(),
              product: returnData.product,
              quantity: returnData.quantity,
              unitQuantity: 1,
              quantityType: 'Piece',
              unitPrice: 0,
              // priceExcludingGst removed
              gstPercentage: 0,
              total: 0,
              isReturned: true,
              returnReason: returnData.returnReason
            };
            setItems(prev => [...prev, returnItem]);
          }}
          onClose={() => setShowReturnDialog(false)}
          availableProducts={searchResults}
        />
      )}
    </div>
  );
};

export default EnhancedBillingForm;
