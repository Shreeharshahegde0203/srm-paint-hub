import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Product } from '../data/products';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';

// Helper: Map snake_case from Supabase to camelCase Product
const mapDbProductToProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  code: dbProduct.code,
  name: dbProduct.name,
  brand: dbProduct.brand,
  type: dbProduct.type,
  color: dbProduct.color,
  price: dbProduct.price,
  stock: dbProduct.stock,
  image: dbProduct.image || undefined,
  gstRate: dbProduct.gst_rate,
  unit: dbProduct.unit,
  batchNumber: dbProduct.batch_number ?? undefined,
  expiryDate: dbProduct.expiry_date ?? undefined,
  description: dbProduct.description ?? undefined,
});

interface ProductSelectorProps {
  onProductSelect: (product: Product) => void;
  selectedProduct?: Product | null;
}

const ProductSelector = ({ onProductSelect, selectedProduct }: ProductSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Use Supabase products instead of static DB
  const { products, isLoading, error } = useSupabaseProducts();

  useEffect(() => {
    if (!products) {
      setFilteredProducts([]);
      return;
    }
    // Map DB products to local Product[]
    const productList: Product[] = products.map(mapDbProductToProduct);

    const filtered = productList.filter(product =>
      product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm(`${product.code} - ${product.name}`);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selectedProduct) {
      setSearchTerm(`${selectedProduct.code} - ${selectedProduct.name}`);
    }
  }, [selectedProduct]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">Product</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by code, name, or brand..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      {isOpen && searchTerm && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-gray-500 text-center">Loading products...</div>
          ) : error ? (
            <div className="p-3 text-red-500 text-center">Error loading products</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{product.code} - {product.name}</p>
                    <p className="text-sm text-gray-600">{product.brand} • {product.type} • {product.color}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
                  </div>
                  <p className="font-bold text-green-600">₹{product.price}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-center">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
