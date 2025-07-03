
import React, { useState } from 'react';
import { X, Package, Plus, Minus, Search } from 'lucide-react';
import { Product } from '../data/products';
import { toast } from "@/hooks/use-toast";
import { useCachedProducts } from '../hooks/useCachedProducts';

interface RestockProductDialogProps {
  onRestock: (productId: string, quantity: number) => Promise<void>;
  onClose: () => void;
}

const RestockProductDialog = ({ onRestock, onClose }: RestockProductDialogProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { products, searchProducts } = useCachedProducts();

  const filteredProducts = searchQuery ? searchProducts(searchQuery) : products.slice(0, 20);

  // Map Supabase product to local Product type
  const mapToProduct = (supabaseProduct: any): Product => ({
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    brand: supabaseProduct.brand,
    type: supabaseProduct.type,
    base: supabaseProduct.base,
    price: supabaseProduct.price,
    stock: supabaseProduct.stock,
    gstRate: supabaseProduct.gst_rate,
    unit: supabaseProduct.unit,
    description: supabaseProduct.description,
    image: supabaseProduct.image,
    unit_quantity: supabaseProduct.unit_quantity,
    hsn_code: supabaseProduct.hsn_code,
    batchNumber: supabaseProduct.batch_number,
    expiryDate: supabaseProduct.expiry_date,
    category: supabaseProduct.category,
  });

  const adjustQuantity = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
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
      await onRestock(selectedProduct.id, quantity);
      toast({
        title: "Success",
        description: `Restocked ${quantity} units of ${selectedProduct.name}`,
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
              Select Product
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
              {filteredProducts.map((product) => {
                const mappedProduct = mapToProduct(product);
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(mappedProduct)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0 ${
                      selectedProduct?.id === product.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{product.brand} • {product.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Stock: {product.stock} {product.unit}</p>
                      </div>
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No products found
                </div>
              )}
            </div>
          </div>

          {/* Selected Product Info */}
          {selectedProduct && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedProduct.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{selectedProduct.brand} • {selectedProduct.type}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock: {selectedProduct.stock} {selectedProduct.unit}</p>
            </div>
          )}

          {/* Quantity Input */}
          {selectedProduct && (
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
            disabled={loading || !selectedProduct}
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
