
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle, Upload } from 'lucide-react';
import { Product, productsDatabase } from '../data/products';

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(productsDatabase);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Updated to match actual product data
  const brands = ['Dulux', 'Indigo'];
  const types = ['Emulsion', 'Exterior', 'Primer', 'Enamel', 'Distemper', 'Wood Paint', 'Specialty'];

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filterBrand === '' || product.brand === filterBrand) &&
    (filterType === '' || product.type === filterType);
  });

  const lowStockProducts = products.filter(product => product.stock < 20);

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const generateProductCode = () => {
    const prefix = 'SRM';
    const number = (products.length + 1).toString().padStart(3, '0');
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

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (product) {
        // Edit existing product
        setProducts(products.map(p => p.id === product.id ? { ...formData, id: product.id } as Product : p));
      } else {
        // Add new product
        const newProduct: Product = {
          ...formData,
          id: Date.now().toString(),
          gstRate: 18,
          unit: 'Litre'
        } as Product;
        setProducts([...products, newProduct]);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Package className="mr-3 h-8 w-8 text-blue-600" />
                Smart Inventory Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your Dulux & Indigo paint stock with product codes and smart tracking</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-lg font-bold text-red-800">Low Stock Alert</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map(product => (
                <div key={product.id} className="bg-white p-4 rounded-lg border border-red-200">
                  <p className="font-medium text-gray-900">{product.code} - {product.name}</p>
                  <p className="text-sm text-gray-600">{product.brand} • {product.color}</p>
                  <p className="text-sm font-bold text-red-600">Only {product.stock} units left</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by code, name, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="mr-2 h-4 w-4" />
              {filteredProducts.length} products found
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Product Image */}
              {product.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {product.brand}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.code}</h3>
                    <p className="text-sm font-medium text-blue-600">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.brand} • {product.type}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{product.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ${product.stock < 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-blue-600">₹{product.price}</span>
                  </div>
                </div>
                
                {product.stock < 20 && (
                  <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">⚠️ Low Stock Alert</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
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
