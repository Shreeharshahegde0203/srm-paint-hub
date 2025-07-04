
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle, X } from 'lucide-react';
import { Product, UNIT_TYPES } from '../data/products';
import StockLevelIcon from '../components/StockLevelIcon';
import ViewModeToggle from '../components/ViewModeToggle';
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { useNavigate } from "react-router-dom";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import EnhancedProductForm from "../components/EnhancedProductForm";

const Inventory = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const {
    products: rawProducts,
    isLoading: isProductsLoading,
    addProduct,
    updateProduct,
    deleteProduct
  } = useSupabaseProducts();

  // Real-time subscription effect is now handled in useSupabaseProducts hook

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('large');
  const [filterType, setFilterType] = useState('all');

  // Map Supabase products to local Product type
  const products: Product[] = (rawProducts || []).map((product: any) => ({
    ...product,
    gstRate: product.gst_rate,
    unit_quantity: parseFloat(product.unit?.split(' ')[0]) || 1,
    unit_type: product.unit?.split(' ').slice(1).join(' ') || 'Piece',
    hsn_code: product.hsn_code,
    base: product.base,
  }));

  const handleAddProduct = async (productData: Omit<Product, 'id'> & { hsn_code?: string }) => {
    const payload: any = {
      name: productData.name,
      brand: productData.brand,
      type: productData.type,
      base: productData.base || null,
      stock: productData.stock,
      price: productData.price,
      gst_rate: productData.gstRate ?? 18,
      unit: `${productData.unit_quantity || 1} ${productData.unit || 'Piece'}`,
      description: productData.description,
      image: productData.image,
      hsn_code: productData.hsn_code || null,
      category: (productData as any).category || null,
      unit_quantity: productData.unit_quantity || 1,
    };

    await addProduct(payload as TablesInsert<"products">);
    setShowAddForm(false);
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product> & { hsn_code?: string }) => {
    try {
      const payload: any = {
        name: productData.name,
        brand: productData.brand,
        type: productData.type,
        base: productData.base || null,
        price: productData.price,
        gst_rate: productData.gstRate,
        unit: `${productData.unit_quantity || 1} ${productData.unit || 'Piece'}`,
        description: productData.description,
        image: productData.image,
        hsn_code: productData.hsn_code || null,
        category: (productData as any).category || null,
        unit_quantity: productData.unit_quantity || 1,
      };

      // Include stock update
      if (productData.stock !== undefined) {
        payload.stock = productData.stock;
      }

      await updateProduct({ id, product: payload as TablesUpdate<"products"> });
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.base && product.base.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'low_stock' && product.stock < 10) ||
      (filterType === 'out_of_stock' && product.stock === 0);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <Package className="mr-3 h-8 w-8 text-blue-600" />
                Enhanced Inventory Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                Complete inventory management with HSN codes, categories, and advanced features
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Product
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, brand, or base..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all duration-200"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all duration-200"
              >
                <option value="all">All Products</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <span>Total Products: <span className="font-bold text-blue-600">{filteredProducts.length}</span></span>
            <span>Low Stock: <span className="font-bold text-orange-600">{products.filter(p => p.stock < 10 && p.stock > 0).length}</span></span>
            <span>Out of Stock: <span className="font-bold text-red-600">{products.filter(p => p.stock === 0).length}</span></span>
          </div>
        </div>

        {/* Products Grid/List */}
        {isProductsLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'large' ? 'grid-cols-1 lg:grid-cols-2' :
            viewMode === 'medium' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            viewMode === 'small' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
            'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onEdit={() => setEditingProduct(product)}
                onDelete={() => handleDeleteProduct(product.id)}
                onRestock={handleUpdateProduct}
                onDoubleClick={() => setEditingProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <EnhancedProductForm
          onSave={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <EnhancedProductForm
          product={editingProduct}
          onSave={(productData) => handleUpdateProduct(editingProduct.id, productData)}
          onCancel={() => setEditingProduct(null)}
          isEditing
        />
      )}
    </div>
  );
};

// Product Card Component with inline restock functionality
interface ProductCardProps {
  product: Product;
  viewMode: string;
  onEdit: () => void;
  onDelete: () => void;
  onRestock: (id: string, productData: Partial<Product>) => Promise<void>;
  onDoubleClick: () => void;
}

const ProductCard = ({ product, viewMode, onEdit, onDelete, onRestock, onDoubleClick }: ProductCardProps) => {
  const [showRestock, setShowRestock] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [newPrice, setNewPrice] = useState(product.price);
  const [isRestocking, setIsRestocking] = useState(false);

  const isListView = viewMode === 'list';

  const handleRestock = async () => {
    if (restockQuantity <= 0) return;
    
    setIsRestocking(true);
    try {
      await onRestock(product.id, {
        stock: product.stock + restockQuantity,
        price: newPrice
      });
      setShowRestock(false);
      setRestockQuantity(1);
    } catch (error) {
      console.error('Error restocking:', error);
    } finally {
      setIsRestocking(false);
    }
  };
  
  if (isListView) {
    return (
      <div onDoubleClick={onDoubleClick} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex items-center justify-between transition-all duration-300 hover:shadow-lg cursor-pointer">
        <div className="flex items-center space-x-4">
          {product.image && (
            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {product.name} {product.base && `- ${product.base}`}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {product.brand} • {product.type}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>₹{product.price}</span>
              <span>Stock: {product.stock}</span>
              <span>HSN: {product.hsn_code || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StockLevelIcon stock={product.stock} />
          <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setShowRestock(!showRestock)} 
            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
          >
            <Package className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        {showRestock && (
          <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-slate-800 border rounded-lg shadow-lg">
            <div className="flex gap-2 items-center mb-2">
              <input
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                placeholder="Quantity"
                className="w-20 p-2 border rounded"
                min="1"
              />
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                placeholder="Price"
                className="w-24 p-2 border rounded"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleRestock}
                disabled={isRestocking}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isRestocking ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div onDoubleClick={onDoubleClick} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full object-cover ${
            viewMode === 'small' ? 'h-24' : 'h-32'
          }`} 
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold text-gray-900 dark:text-white ${
            viewMode === 'small' ? 'text-sm' : 'text-base'
          }`}>
            {product.name}
            {product.base && <span className="text-gray-500"> - {product.base}</span>}
          </h3>
          <StockLevelIcon stock={product.stock} />
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {product.brand} • {product.type}
        </p>
        
        <div className="space-y-1 text-xs text-gray-500 mb-3">
          <div>Price: ₹{product.price} ({product.gstRate}% GST)</div>
          <div>Stock: {product.stock} {product.unit}</div>
          {product.hsn_code && <div>HSN: {product.hsn_code}</div>}
          {(product as any).category && <div>Category: {(product as any).category}</div>}
        </div>

        {product.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                title="Edit Product"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowRestock(!showRestock)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                title="Restock Product"
              >
                <Package className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                title="Delete Product"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            {product.stock < 10 && (
              <div className="flex items-center text-orange-600 text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
              </div>
            )}
          </div>

          {showRestock && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Add Quantity</label>
                  <input
                    type="number"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-green-500"
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    New stock: {product.stock + restockQuantity}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Unit Price</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRestock}
                    disabled={isRestocking || restockQuantity <= 0}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isRestocking ? 'Adding...' : 'Add Stock'}
                  </button>
                  <button
                    onClick={() => setShowRestock(false)}
                    className="px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
