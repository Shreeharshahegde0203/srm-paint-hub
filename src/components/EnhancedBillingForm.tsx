
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Bill' : 'Create New Bill'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bill Type Selection */}
          <div>
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
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Information */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <button
                onClick={() => setShowCustomerForm(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {customer.name ? 'Edit Customer' : 'Add Customer Details'}
              </button>
            </div>
            
            {customer.name ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><strong>Name:</strong> {customer.name}</div>
                <div><strong>Phone:</strong> {customer.phone || 'N/A'}</div>
                <div><strong>Customer #:</strong> {customer.customer_number || 'N/A'}</div>
                <div><strong>GSTIN:</strong> {customer.gstin || 'N/A'}</div>
                <div className="col-span-2"><strong>Address:</strong> {customer.address || 'N/A'}</div>
              </div>
            ) : (
              <p className="text-gray-500">No customer information added</p>
            )}
          </div>

          {/* Product Search */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Add Products</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products by name or base..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addItemFromProduct(product)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}{product.base ? ` - ${product.base}` : ''}
                        </p>
                        <p className="text-sm text-gray-600">{product.brand} • {product.type}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock} {product.unit}</p>
                      </div>
                      <p className="font-bold text-green-600">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items Table */}
          {items.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Bill Items ({items.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-center">Color/Code</th>
                      <th className="px-4 py-3 text-center">Quantity</th>
                      <th className="px-4 py-3 text-center">Unit</th>
                      {billType !== 'casual' && <th className="px-4 py-3 text-center">Price/Unit</th>}
                      {billType === 'gst' && <th className="px-4 py-3 text-center">GST%</th>}
                      {billType !== 'casual' && <th className="px-4 py-3 text-center">Total</th>}
                      <th className="px-4 py-3 text-center">Actions</th>
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
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {billType === 'gst' && (
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
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update Bill' : 'Save Bill'}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <EnhancedCustomerForm
          customer={customer.name ? customer : null}
          onSave={(customerData) => {
            setCustomer(customerData);
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
    <tr className={`${item.isReturned ? 'bg-red-50 text-red-800' : ''}`}>
      <td className="px-4 py-3 border-b">
        <div>
          <p className="font-medium">
            {item.product.name}
            {item.isReturned && <span className="text-red-600 ml-2">(RETURNED)</span>}
          </p>
          <p className="text-sm text-gray-500">
            {item.product.brand} • {item.product.base || 'No Base'}
          </p>
          {item.isReturned && item.returnReason && (
            <p className="text-xs text-red-600">Reason: {item.returnReason}</p>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3 border-b text-center">
        {isEditing ? (
          <input
            type="text"
            value={editValues.colorCode}
            onChange={(e) => setEditValues(prev => ({ ...prev, colorCode: e.target.value }))}
            className="w-20 px-2 py-1 border rounded text-center"
            placeholder="Color"
          />
        ) : (
          item.colorCode || '-'
        )}
      </td>
      
      <td className="px-4 py-3 border-b text-center">
        <div className="flex items-center justify-center space-x-1">
          <button
            onClick={() => onAdjustQuantity(item.id, false)}
            className="p-1 border rounded hover:bg-gray-50"
          >
            <Minus className="h-3 w-3" />
          </button>
          {isEditing ? (
            <input
              type="number"
              step="0.5"
              value={editValues.quantity}
              onChange={(e) => setEditValues(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              className="w-16 px-2 py-1 border rounded text-center"
            />
          ) : (
            <span className="w-16 text-center">{item.quantity}</span>
          )}
          <button
            onClick={() => onAdjustQuantity(item.id, true)}
            className="p-1 border rounded hover:bg-gray-50"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </td>
      
      <td className="px-4 py-3 border-b text-center">{item.unitType}</td>
      
      {billType !== 'casual' && (
        <td className="px-4 py-3 border-b text-center">
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={editValues.priceExcludingGst}
              onChange={(e) => setEditValues(prev => ({ ...prev, priceExcludingGst: parseFloat(e.target.value) || 0 }))}
              className="w-20 px-2 py-1 border rounded text-center"
            />
          ) : (
            `₹${item.priceExcludingGst.toFixed(2)}`
          )}
        </td>
      )}
      
      {billType === 'gst' && (
        <td className="px-4 py-3 border-b text-center">
          {isEditing ? (
            <input
              type="number"
              value={editValues.gstPercentage}
              onChange={(e) => setEditValues(prev => ({ ...prev, gstPercentage: parseInt(e.target.value) || 0 }))}
              className="w-16 px-2 py-1 border rounded text-center"
            />
          ) : (
            `${item.gstPercentage}%`
          )}
        </td>
      )}
      
      {billType !== 'casual' && (
        <td className="px-4 py-3 border-b text-center font-semibold">
          ₹{(item.isReturned ? -item.total : item.total).toFixed(2)}
        </td>
      )}
      
      <td className="px-4 py-3 border-b">
        <div className="flex items-center justify-center space-x-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:text-green-800"
                title="Save"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              {!item.isReturned && (
                <button
                  onClick={handleReturn}
                  className="p-1 text-orange-600 hover:text-orange-800"
                  title="Return"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onRemove(item.id)}
                className="p-1 text-red-600 hover:text-red-800"
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
