import React, { useState } from 'react';
import { Shield, Users, Settings, BarChart3, Package, FileText, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductManagement from '../components/ProductManagement';
import { Product, productsDatabase } from '../data/products';
import AdminInfoDialog from '../components/AdminInfoDialog';

const Admin = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>(productsDatabase);

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...productData } : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const lowStockProducts = products.filter(product => product.stock < 20);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Shield className="mr-3 h-8 w-8 text-blue-600" />
                Shreeram Marketing - Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Complete administrative control panel</p>
            </div>
            <div className="flex items-center">
              {/* Just a component, NOT inside any <Link>! */}
              <AdminInfoDialog />
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center ml-3 dark:bg-red-800 dark:hover:bg-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* ... keep existing code (rest of dashboard) the same ... */}
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{lowStockProducts.length}</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹2,85,400</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
              </div>
              <Settings className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/inventory"
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left block"
          >
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Inventory Management</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Manage stock levels, add new products, and track inventory movements.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Products:</span>
                <span className="text-sm font-medium text-blue-600">{products.length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Low Stock:</span>
                <span className="text-sm font-medium text-red-600">{lowStockProducts.length} items</span>
              </div>
            </div>
          </Link>

          <Link
            to="/billing"
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left block"
          >
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Billing System</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Create professional invoices and manage customer billing.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">This Month:</span>
                <span className="text-sm font-medium text-green-600">₹2,85,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Invoices:</span>
                <span className="text-sm font-medium text-blue-600">156</span>
              </div>
            </div>
          </Link>

          <Link
            to="/reports"
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left block"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Track sales performance, revenue trends, and business metrics.</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Growth:</span>
                <span className="text-sm font-medium text-green-600">+12.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Avg Order:</span>
                <span className="text-sm font-medium text-blue-600">₹2,840</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6 transition-colors">
            <h2 className="text-lg font-bold text-red-800 dark:text-red-300 mb-4">Urgent: Low Stock Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.slice(0, 6).map(product => (
                <div key={product.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-red-200 dark:border-red-700">
                  <p className="font-medium text-gray-900 dark:text-white">{product.code} - {product.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{product.brand} • {product.color}</p>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">Only {product.stock} units left</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Product Management */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Product Management</h2>
          <ProductManagement
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
