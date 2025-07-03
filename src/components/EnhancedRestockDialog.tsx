
import React, { useState } from 'react';
import { X, Package, Plus, Minus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  brand: string;
  type: string;
  base?: string;
  price: number;
  stock: number;
  unit: string;
  image?: string;
}

interface EnhancedRestockDialogProps {
  product: Product;
  onRestock: (productId: string, quantity: number, newPrice?: number) => Promise<void>;
  onClose: () => void;
}

const EnhancedRestockDialog = ({ product, onRestock, onClose }: EnhancedRestockDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [newPrice, setNewPrice] = useState(product.price);
  const [priceChanged, setPriceChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const adjustQuantity = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  const handlePriceChange = (value: number) => {
    setNewPrice(value);
    setPriceChanged(value !== product.price);
  };

  const handleRestock = async () => {
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
      await onRestock(product.id, quantity, priceChanged ? newPrice : undefined);
      toast({
        title: "Success",
        description: `Restocked ${quantity} units of ${product.name}${priceChanged ? ` with new price ₹${newPrice}` : ''}`,
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Package className="mr-3 h-6 w-6 text-blue-600" />
            Restock Product
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{product.brand} • {product.type}</p>
            {product.base && <p className="text-sm text-gray-500 dark:text-gray-400">Base: {product.base}</p>}
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock: {product.stock} {product.unit}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Price: ₹{product.price}</p>
          </div>

          {/* Quantity Input */}
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
              New stock will be: {product.stock + quantity} {product.unit}
            </p>
          </div>

          {/* Price Update */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Update Price (Optional)
            </label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              min="0"
              step="0.01"
            />
            {priceChanged && (
              <p className="text-sm text-orange-600 mt-1">
                Price will be updated from ₹{product.price} to ₹{newPrice}
              </p>
            )}
          </div>
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
            disabled={loading}
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

export default EnhancedRestockDialog;
