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
import RestockProductDialog from "../components/RestockProductDialog";

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

  const [showAddForm, setShowAddForm] = useState(false);
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  const [restockingProduct, setRestockingProduct] = useState<Product | null>(null);
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

    await updateProduct({ id, product: payload as TablesUpdate<"products"> });
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleRestockProduct = async (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newStock = product.stock + quantity;
      await updateProduct({ 
        id: productId, 
        product: { stock: newStock } as TablesUpdate<"products"> 
      });
      setRestockingProduct(null);
    }
  };

  const openRestockDialog = (product: Product) => {
    setRestockingProduct(product);
    setShowRestockDialog(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Package className="mr-3 h-8 w-8 text-blue-600" />
                Enhanced Inventory Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Complete inventory management with HSN codes, categories, and advanced features
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Product
              </button>
              <button
                onClick={() => setShowRestockDialog(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center font-semibold"
              >
                <Package className="mr-2 h-5 w-5" />
                Restock Product
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="all">All Products</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <span>Total Products: {filteredProducts.length}</span>
            <span>Low Stock: {products.filter(p => p.stock < 10 && p.stock > 0).length}</span>
            <span>Out of Stock: {products.filter(p => p.stock === 0).length}</span>
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
                onRestock={() => openRestockDialog(product)}
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

      {/* Restock Product Dialog */}
      {showRestockDialog && (
        <RestockProductDialog
          onRestock={handleRestockProduct}
          onClose={() => setShowRestockDialog(false)}
        />
      )}
    </div>
  );
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  viewMode: string;
  onEdit: () => void;
  onDelete: () => void;
  onRestock: () => void;
}

const ProductCard = ({ product, viewMode, onEdit, onDelete, onRestock }: ProductCardProps) => {
  const isListView = viewMode === 'list';
  
  if (isListView) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 flex items-center justify-between">
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
          <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={onRestock} className="p-2 text-green-600 hover:bg-green-50 rounded">
            <Package className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
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

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="Edit Product"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={onRestock}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Restock Product"
            >
              <Package className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
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
      </div>
    </div>
  );
};

export default Inventory;
