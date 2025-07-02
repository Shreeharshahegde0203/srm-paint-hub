
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Search, ShoppingCart, Edit3, Trash2, RotateCcw } from 'lucide-react';
import { Product, isValidQuantity, UNIT_TYPES } from '../data/products';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import EnhancedCustomerForm from './EnhancedCustomerForm';

interface BillingItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  priceExcludingGst: number;
  gstPercentage: number;
  colorCode?: string;
  unitType: string;
  total: number;
  isReturned?: boolean;
  returnReason?: string;
}

interface BillingFormProps {
  onClose: () => void;
  onSave: (billData: any) => void;
  existingBill?: any;
  isEditing?: boolean;
}

const EnhancedBillingForm = ({ onClose, onSave, existingBill, isEditing = false }: BillingFormProps) => {
  const [billType, setBillType] = useState<'gst' | 'non_gst' | 'casual'>('gst');
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    customer_number: '',
    gstin: ''
  });
  
  const [items, setItems] = useState<BillingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
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

  const addItemFromProduct = (product: Product) => {
    const priceExcludingGst = billType === 'gst' ? product.price / (1 + product.gstRate / 100) : product.price;
    
    const newItem: BillingItem = {
      id: Date.now().toString(),
      product,
      quantity: 1,
      unitPrice: product.price,
      priceExcludingGst,
      gstPercentage: product.gstRate,
      unitType: product.unit,
      colorCode: '',
      total: priceExcludingGst
    };
    
    setItems(prev => [...prev, newItem]);
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  const updateItem = (itemId: string, updates: Partial<BillingItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, ...updates };
        
        // Recalculate total when quantity or price changes
        if (updates.quantity !== undefined || updates.priceExcludingGst !== undefined) {
          updated.total = updated.quantity * updated.priceExcludingGst;
        }
        
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const returnItem = (itemId: string, reason?: string) => {
    updateItem(itemId, { isReturned: true, returnReason: reason });
  };

  const adjustQuantity = (itemId: string, increment: boolean) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newQuantity = increment ? item.quantity + 0.5 : Math.max(0.5, item.quantity - 0.5);
      if (isValidQuantity(newQuantity)) {
        updateItem(itemId, { quantity: newQuantity });
      }
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.isReturned ? -item.total : item.total), 0);
    const gstAmount = billType === 'gst' ? subtotal * 0.18 : 0;
    const total = subtotal + gstAmount;
    
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

    const { subtotal, gstAmount, total } = calculateTotals();
    
    const billData = {
      customer,
      items,
      billType,
      subtotal,
      gstAmount,
      total,
      createdAt: new Date().toISOString()
    };
    
    onSave(billData);
  };

  const { subtotal, gstAmount, total } = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? '✏️ Edit Bill' : '📄 Create New Bill'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Bill Type Selection */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-lg">
            <label className="block text-lg font-semibold mb-4 text-gray-900 dark:text-white">Bill Type</label>
            <div className="flex flex-wrap gap-4">
              {(['gst', 'non_gst', 'casual'] as const).map(type => (
                <label key={type} className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-transparent hover:border-blue-300 cursor-pointer">
                  <input
                    type="radio"
                    value={type}
                    checked={billType === type}
                    onChange={(e) => setBillType(e.target.value as any)}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {type.replace('_', ' ')} Bill
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                👤 Customer Information
              </h3>
              <button
                onClick={() => setShowCustomerForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {customer.name ? '✏️ Edit Customer' : '➕ Add Customer'}
              </button>
            </div>
            
            {customer.name ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Name:</span>
                  <span className="text-gray-900 dark:text-white">{customer.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Phone:</span>
                  <span className="text-gray-900 dark:text-white">{customer.phone || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Customer #:</span>
                  <span className="text-gray-900 dark:text-white">{customer.customer_number || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">GSTIN:</span>
                  <span className="text-gray-900 dark:text-white">{customer.gstin || 'N/A'}</span>
                </div>
                <div className="flex flex-col md:col-span-2">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Address:</span>
                  <span className="text-gray-900 dark:text-white">{customer.address || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-lg">No customer information added yet</p>
                <p className="text-sm">Click "Add Customer" to get started</p>
              </div>
            )}
          </div>

          {/* Product Search */}
          <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <label className="block text-xl font-bold mb-4 text-gray-900 dark:text-white">🔍 Add Products</label>
            <div className="relative">
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
            </div>
            
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto mt-2 mx-6">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addItemFromProduct(product)}
                    className="p-4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
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

          {/* Items Table */}
          {items.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-6">
                <h3 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
                  <ShoppingCart className="mr-3 h-6 w-6 text-green-600" />
                  Bill Items ({items.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white">Product</th>
                      <th className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">Color/Code</th>
                      <th className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">Quantity</th>
                      <th className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">Unit</th>
                      {billType !== 'casual' && <th className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">Price/Unit</th>}
                      {billType === 'gst' && <th className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">GST%</th>}
                      {billType !== 'casual' && <th className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">Total</th>}
                      <th className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        billType={billType}
                        onUpdate={updateItem}
                        onRemove={removeItem}
                        onReturn={returnItem}
                        onAdjustQuantity={adjustQuantity}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Totals */}
          {items.length > 0 && billType !== 'casual' && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl p-6">
              <div className="flex justify-end">
                <div className="w-96 space-y-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {billType === 'gst' && (
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-gray-700 dark:text-gray-300">GST (18%):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{gstAmount.toFixed(2)}</span>
                    </div>
                  )}
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
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-colors shadow-lg"
            >
              {isEditing ? '💾 Update Bill' : '💾 Save Bill'}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <EnhancedCustomerForm
          customer={customer.name ? customer : null}
          onSave={(customerData) => {
            setCustomer({
              name: customerData.name,
              phone: customerData.phone || '',
              address: customerData.address || '',
              email: customerData.email || '',
              customer_number: customerData.customer_number || '',
              gstin: customerData.gstin || ''
            });
            setShowCustomerForm(false);
          }}
          onCancel={() => setShowCustomerForm(false)}
        />
      )}
    </div>
  );
};

// Item Row Component
interface ItemRowProps {
  item: BillingItem;
  billType: 'gst' | 'non_gst' | 'casual';
  onUpdate: (itemId: string, updates: Partial<BillingItem>) => void;
  onRemove: (itemId: string) => void;
  onReturn: (itemId: string, reason?: string) => void;
  onAdjustQuantity: (itemId: string, increment: boolean) => void;
}

const ItemRow = ({ item, billType, onUpdate, onRemove, onReturn, onAdjustQuantity }: ItemRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    colorCode: item.colorCode || '',
    quantity: item.quantity,
    priceExcludingGst: item.priceExcludingGst,
    gstPercentage: item.gstPercentage
  });

  const handleSave = () => {
    onUpdate(item.id, editValues);
    setIsEditing(false);
  };

  const handleReturn = () => {
    const reason = prompt('Return reason (optional):');
    onReturn(item.id, reason || undefined);
  };

  return (
    <tr className={`${item.isReturned ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} transition-colors`}>
      <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {item.product.name}
            {item.isReturned && <span className="text-red-600 ml-2 font-bold">(RETURNED)</span>}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {item.product.brand} • {item.product.base || 'No Base'}
          </p>
          {item.isReturned && item.returnReason && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Reason: {item.returnReason}</p>
          )}
        </div>
      </td>
      
      <td className="px-4 py-4 border-b border-gray-200 dark:border-gray-600 text-center">
        {isEditing ? (
          <input
            type="text"
            value={editValues.colorCode}
            onChange={(e) => setEditValues(prev => ({ ...prev, colorCode: e.target.value }))}
            className="w-24 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Color"
          />
        ) : (
          <span className="text-gray-900 dark:text-white">{item.colorCode || '-'}</span>
        )}
      </td>
      
      <td className="px-4 py-4 border-b border-gray-200 dark:border-gray-600 text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onAdjustQuantity(item.id, false)}
            className="p-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
          >
            <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          {isEditing ? (
            <input
              type="number"
              step="0.5"
              value={editValues.quantity}
              onChange={(e) => setEditValues(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              className="w-20 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          ) : (
            <span className="w-20 text-center text-gray-900 dark:text-white font-medium">{item.quantity}</span>
          )}
          <button
            onClick={() => onAdjustQuantity(item.id, true)}
            className="p-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
          >
            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </td>
      
      <td className="px-4 py-4 border-b border-gray-200 dark:border-gray-600 text-center text-gray-900 dark:text-white">{item.unitType}</td>
      
      {billType !== 'casual' && (
        <td className="px-4 py-4 border-b border-gray-200 dark:border-gray-600 text-center">
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={editValues.priceExcludingGst}
              onChange={(e) => setEditValues(prev => ({ ...prev, priceExcludingGst: parseFloat(e.target.value) || 0 }))}
              className="w-24 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">₹{item.priceExcludingGst.toFixed(2)}</span>
          )}
        </td>
      )}
      
      {billType === 'gst' && (
        <td className="px-4 py-4 border-b border-gray-200 dark:border-gray-600 text-center">
          {isEditing ? (
            <input
              type="number"
              value={editValues.gstPercentage}
              onChange={(e) => setEditValues(prev => ({ ...prev, gstPercentage: parseInt(e.target.value) || 0 }))}
              className="w-20 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">{item.gstPercentage}%</span>
          )}
        </td>
      )}
      
      {billType !== 'casual' && (
        <td className="px-4 py-4 border-b border-gray-200 dark:border-gray-600 text-center font-bold text-lg">
          <span className={item.isReturned ? 'text-red-600' : 'text-green-600'}>
            ₹{(item.isReturned ? -item.total : item.total).toFixed(2)}
          </span>
        </td>
      )}
      
      <td className="px-4 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded dark:hover:bg-green-900"
                title="Save"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded dark:hover:bg-red-900"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded dark:hover:bg-blue-900"
                title="Edit"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              {!item.isReturned && (
                <button
                  onClick={handleReturn}
                  className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded dark:hover:bg-orange-900"
                  title="Return"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onRemove(item.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded dark:hover:bg-red-900"
                title="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EnhancedBillingForm;
