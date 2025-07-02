
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useUnifiedProducts } from '../hooks/useUnifiedProducts';
import { useCachedBrands } from '../hooks/useReferenceData';
import { Product } from '../data/products';

// Helper to map unified product to local Product interface
const mapUnifiedProductToProduct = (unifiedProduct: any): Product => ({
  id: unifiedProduct.id,
  name: unifiedProduct.name,
  brand: unifiedProduct.brand,
  type: unifiedProduct.type,
  base: unifiedProduct.base,
  price: unifiedProduct.price,
  stock: unifiedProduct.stock,
  image: undefined,
  gstRate: unifiedProduct.gstRate || 18,
  unit: unifiedProduct.unit || 'Litre',
  batchNumber: undefined,
  expiryDate: undefined,
  description: unifiedProduct.description,
});

interface EnhancedProductSelectorProps {
  onProductSelect: (product: Product) => void;
  selectedProduct?: Product | null;
}

const EnhancedProductSelector = ({ onProductSelect, selectedProduct }: EnhancedProductSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);

  const { products, isLoading, searchProducts } = useUnifiedProducts();
  const { getBrandSuggestions } = useCachedBrands();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (searchTerm) {
      // Search in unified products
      const results = searchProducts(searchTerm);
      const mappedResults = results.map(mapUnifiedProductToProduct);
      setFilteredProducts(mappedResults);
      
      // Get brand suggestions
      const suggestions = getBrandSuggestions(searchTerm);
      setBrandSuggestions(suggestions);
    } else {
      setFilteredProducts([]);
      setBrandSuggestions([]);
    }
  }, [searchTerm, searchProducts, getBrandSuggestions]);

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm(`${product.name}`);
    setIsOpen(false);
    setShowBrandSuggestions(false);
  };

  const handleBrandSelect = (brand: string) => {
    setSearchTerm(brand);
    setShowBrandSuggestions(false);
    setIsOpen(true);
    // Filter products by selected brand
    const brandProducts = products
      .filter(p => p.brand?.toLowerCase() === brand.toLowerCase())
      .map(mapUnifiedProductToProduct);
    setFilteredProducts(brandProducts);
  };

  useEffect(() => {
    if (selectedProduct) {
      setSearchTerm(`${selectedProduct.name}`);
    }
  }, [selectedProduct]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">Product</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name or brand (try 'Dulux' or 'Indigo')..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setShowBrandSuggestions(e.target.value.length > 0 && filteredProducts.length === 0);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (searchTerm && filteredProducts.length === 0) {
              setShowBrandSuggestions(true);
            }
          }}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Brand suggestions dropdown */}
      {isOpen && showBrandSuggestions && brandSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
          <div className="p-2 bg-gray-50 text-xs font-medium text-gray-600">Brand Suggestions</div>
          {brandSuggestions.map((brand) => (
            <div
              key={brand}
              onClick={() => handleBrandSelect(brand)}
              className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <span className="text-blue-600 text-sm">🏷️</span>
                <span className="ml-2 font-medium text-gray-900">{brand}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product results dropdown */}
      {isOpen && !showBrandSuggestions && searchTerm && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-gray-500 text-center">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.brand} • {product.type} • {product.base || 'No Base'}</p>
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock} units
                      {product.stock === 0 && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                          Catalog Only
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">₹{product.price}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-center">
              No products found. Try searching by brand like "Dulux" or "Indigo"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedProductSelector;
