import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Product } from '../data/products';
import StockLevelIcon from '../components/StockLevelIcon';
import ViewModeToggle from '../components/ViewModeToggle';
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { useNavigate } from "react-router-dom";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Define possible view modes as a type
type ViewMode = "large" | "medium" | "small" | "list";

const VIEW_MODE_KEY = "inventory_view_mode";
const DEFAULT_VIEW: ViewMode = "large";

const Inventory = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const {
    products,
    isLoading: isProductsLoading,
    addProduct,
    updateProduct,
    deleteProduct
  } = useSupabaseProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    // Ensure value is of type ViewMode, fallback to DEFAULT_VIEW if not
    if (stored === "large" || stored === "medium" || stored === "small" || stored === "list") {
      return stored;
    }
    return DEFAULT_VIEW;
  });

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const brands = ['Dulux', 'Indigo'];
  const types = ['Emulsion', 'Exterior', 'Primer', 'Enamel', 'Distemper', 'Wood Paint', 'Specialty'];

  const filteredProducts = products?.filter(product => {
    return (
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color?.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filterBrand === '' || product.brand === filterBrand) &&
    (filterType === '' || product.type === filterType);
  }) || [];

  const lowStockProducts = products?.filter(product => product.stock < 20) || [];

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
  };

  const generateProductCode = () => {
    const prefix = 'SRM';
    const number = ((products?.length || 0) + 1).toString().padStart(3, '0');
    return `${prefix}${number}`;
  };

  const ProductForm = ({ product, onClose }: { product?: Product; onClose: () => void }) => {
    const [formData, setFormData] = useState<Partial<Product>>(
      product || {
        code: generateProductCode(),
        name: '',
        brand: '',
        type: '',
        color: '',
        stock: 0,
        price: 0,
        gstRate: 18,
        unit: 'Litre',
      }
    );

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (product) {
        // Edit existing product
        await updateProduct({ id: product.id, product: formData as TablesUpdate<"products"> });
      } else {
        // Add new product
        const newProduct: TablesInsert<"products"> = {
          ...formData,
          gst_rate: 18,
          unit: 'Litre'
        } as TablesInsert<"products">;
        await addProduct(newProduct);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2 border rounded-lg bg-gray-50"
                readOnly={!!product}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select Type</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-lg"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-lg"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {product ? 'Update' : 'Add'} Product
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Helper: grid classes per view mode
  const gridClass = 
    viewMode === "large" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
    viewMode === "medium" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :
    viewMode === "small" ? "grid-cols-3 md:grid-cols-4 lg:grid-cols-6" :
    "grid-cols-1";

  // Card inner size per view mode
  function renderProductCard(product: Product) {
    if (viewMode === "list") {
      return (
        <div key={product.id} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 p-3 border-b border-gray-100 bg-white dark:bg-slate-800 hover:bg-blue-50/40 dark:hover:bg-slate-700 transition rounded-lg">
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 min-w-0">
            <span className="text-xs text-gray-400 font-mono min-w-12 w-16">{product.code}</span>
            <span className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 px-2">{product.brand}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{product.type} • {product.color}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <StockLevelIcon stock={product.stock} />
            <span className="font-semibold text-blue-700 dark:text-blue-300 text-xs">₹{product.price}</span>
            <button onClick={() => setEditingProduct(product)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 p-2 rounded-lg"><Edit className="h-4 w-4"/></button>
            <button onClick={() => handleDelete(product.id)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded-lg"><Trash2 className="h-4 w-4"/></button>
          </div>
        </div>
      );
    }
    // Grid cards (large/medium/small)
    return (
      <div key={product.id} className={
        "bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow " +
        (viewMode === "medium" ? "p-2" : viewMode === "small" ? "p-1" : "")
      }>
        {(product.image && viewMode === "large") && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={e => { e.currentTarget.style.display='none'; }}
            />
            <div className="absolute top-2 right-2">
              <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-100">{product.brand}</span>
            </div>
          </div>
        )}
        <div className={`p-${viewMode === "small" ? 2 : 6}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.code}</h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-300 line-clamp-1">{product.name}</p>
              {viewMode !== "small" && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{product.brand} • {product.type}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 p-2 rounded-lg"
              ><Edit className="h-4 w-4" /></button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded-lg"
              ><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-300">Color:</span>
              <span className="font-medium dark:text-gray-200">{product.color}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-300">Stock:</span>
              <StockLevelIcon stock={product.stock} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-300">Price:</span>
              <span className="font-medium text-blue-600 dark:text-blue-300">₹{product.price}</span>
            </div>
          </div>
          {product.stock < 20 && viewMode === "large" && (
            <div className="mt-4 p-2 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">⚠️ Low Stock Alert</p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
                Smart Inventory Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your Dulux & Indigo paint stock with product codes and smart tracking</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6 transition-colors">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-lg font-bold text-red-800 dark:text-red-200">Low Stock Alert</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map(product => (
                <div key={product.id} className="bg-white dark:bg-red-950/50 p-4 rounded-lg border border-red-200 dark:border-red-800 transition-colors">
                  <p className="font-medium text-gray-900 dark:text-white">{product.code} - {product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{product.brand} • {product.color}</p>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">Only {product.stock} units left</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters + View Mode Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by code, name, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            </div>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {/* View Mode Toggle */}
            <div className="flex items-center justify-end">
              <ViewModeToggle
                value={viewMode}
                onChange={(val: string) => {
                  // Accept only ViewMode strings
                  if (val === "large" || val === "medium" || val === "small" || val === "list") {
                    setViewMode(val);
                  }
                }}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Filter className="mr-2 h-4 w-4" />
            {filteredProducts.length} products found
          </div>
        </div>

        {/* Products */}
        {viewMode === "list" ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-x-auto transition-colors">
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredProducts.map(product => renderProductCard(product))}
            </div>
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-6`}>
            {filteredProducts.map(product => renderProductCard(product))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <ProductForm onClose={() => setShowAddForm(false)} />
      )}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default Inventory;
