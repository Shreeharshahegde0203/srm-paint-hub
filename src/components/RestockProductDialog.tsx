
import React, { useState } from 'react';
import { X, Package, Plus, Minus, Search } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';

interface RestockProductDialogProps {
  onRestock: (productId: string, quantity: number, newPrice?: number) => Promise<void>;
  onClose: () => void;
}

const RestockProductDialog = ({ onRestock, onClose }: RestockProductDialogProps) => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [newPrice, setNewPrice] = useState(0);
  const [priceChanged, setPriceChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFields, setShowFields] = useState(false);
  const { products } = useSupabaseProducts();

  const filteredProducts = searchQuery 
    ? (products || []).filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 20)
    : (products || []).slice(0, 20);

  const adjustQuantity = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  const adjustPrice = (increment: boolean) => {
    if (increment) {
      setNewPrice(prev => prev + 1);
    } else {
      setNewPrice(prev => Math.max(0, prev - 1));
    }
  };

  const handleProductSelect = (product: any) => {
    if (selectedProduct?.id === product.id && !showFields) {
      // Second click - show fields
      setShowFields(true);
      setNewPrice(Number(product.price));
      setPriceChanged(false);
      setQuantity(1);
    } else {
      // First click - select product
      setSelectedProduct(product);
      setShowFields(false);
    }
  };

  const handlePriceChange = (value: number) => {
    setNewPrice(value);
    setPriceChanged(selectedProduct && value !== Number(selectedProduct.price));
  };

  const handleRestock = async () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product to restock",
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

    setLoading(true);
    try {
      await onRestock(selectedProduct.id, quantity, priceChanged ? newPrice : undefined);
      toast({
        title: "Success",
        description: `Restocked ${quantity} units of ${selectedProduct.name}${priceChanged ? ` with new price ₹${newPrice}` : ''}`,
      });
      onClose();
    } catch (error) {
      console.error('Error restocking:', error);
      toast({
        title: "Error",
        description: "Failed to restock product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Package className="mr-3 h-6 w-6 text-blue-600" />
            Restock Product
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Product Search */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Search Product
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search by name, brand, or type..."
              />
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Select Product (Click twice to show restock fields)
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0 ${
                    selectedProduct?.id === product.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{product.brand} • {product.type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Stock: {product.stock} {product.unit} • Price: ₹{product.price}</p>
                    </div>
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    )}
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No products found
                </div>
              )}
            </div>
          </div>

          {/* Restock Fields - Only show when product is double-clicked */}
          {selectedProduct && showFields && (
            <>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedProduct.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{selectedProduct.brand} • {selectedProduct.type}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock: {selectedProduct.stock} {selectedProduct.unit}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Price: ₹{selectedProduct.price}</p>
              </div>

              {/* Restock Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Restock Quantity
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => adjustQuantity(false)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-center focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => adjustQuantity(true)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  New stock will be: {selectedProduct.stock + quantity} {selectedProduct.unit}
                </p>
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Unit Price
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => adjustPrice(false)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    disabled={newPrice <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-center focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                    step="0.01"
                  />
                  <button
                    type="button"
                    onClick={() => adjustPrice(true)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {priceChanged && (
                  <p className="text-sm text-orange-600 mt-1">
                    Price will be updated from ₹{selectedProduct.price} to ₹{newPrice}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleRestock}
            disabled={loading || !selectedProduct || !showFields}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Restocking...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Restock
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestockProductDialog;
