
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Product } from '../data/products';

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductManagement = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateProductCode = () => {
    const number = (products.length + 1).toString().padStart(3, '0');
    return `SRM${number}`;
  };

  const ProductForm = ({ product, onClose }: { product?: Product; onClose: () => void }) => {
    const [formData, setFormData] = useState<Partial<Product>>(
      product || {
        code: generateProductCode(),
        name: '',
        brand: '',
        type: '',
        color: '',
        price: 0,
        stock: 0,
        gstRate: 18,
        unit: 'Litre',
        description: ''
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (product) {
        onUpdateProduct(product.id, formData);
      } else {
        onAddProduct(formData as Omit<Product, 'id'>);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto transition-colors">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Product Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                {product ? 'Update' : 'Add'} Product
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-100 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Database</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
        />
      </div>

      {/* Products List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <span className="font-medium text-blue-600">{product.code}</span>
                <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{product.brand}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">₹{product.price}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Stock: {product.stock}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setShowForm(true);
                }}
                className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 p-1 rounded"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-1 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No products found. Add your first product to get started.
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;
