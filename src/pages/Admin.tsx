
import React, { useState } from 'react';
import { Shield, Users, Settings, BarChart3, Package, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProductManagement from '../components/ProductManagement';
import { Product, productsDatabase } from '../data/products';

const Admin = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>(productsDatabase);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'inventory' | 'billing' | 'reports'>('dashboard');

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

  const renderDashboard = () => (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-600">{lowStockProducts.length}</p>
            </div>
            <Users className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹2,85,400</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <Settings className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => setActiveSection('inventory')}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center mb-4">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Inventory Management</h3>
          </div>
          <p className="text-gray-600 mb-4">Manage stock levels, add new products, and track inventory movements.</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Products:</span>
              <span className="text-sm font-medium text-blue-600">{products.length} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Low Stock:</span>
              <span className="text-sm font-medium text-red-600">{lowStockProducts.length} items</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('billing')}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Billing System</h3>
          </div>
          <p className="text-gray-600 mb-4">Create professional invoices and manage customer billing.</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">This Month:</span>
              <span className="text-sm font-medium text-green-600">₹2,85,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Invoices:</span>
              <span className="text-sm font-medium text-blue-600">156</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveSection('reports')}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left"
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Reports & Analytics</h3>
          </div>
          <p className="text-gray-600 mb-4">Track sales performance, revenue trends, and business metrics.</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Growth:</span>
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Order:</span>
              <span className="text-sm font-medium text-blue-600">₹2,840</span>
            </div>
          </div>
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-red-800 mb-4">Urgent: Low Stock Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.slice(0, 6).map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg border border-red-200">
                <p className="font-medium text-gray-900">{product.code} - {product.name}</p>
                <p className="text-sm text-gray-600">{product.brand} • {product.color}</p>
                <p className="text-sm font-bold text-red-600">Only {product.stock} units left</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderInventory = () => (
    <ProductManagement
      products={products}
      onAddProduct={handleAddProduct}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
    />
  );

  const renderBilling = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Billing System</h2>
      <p className="text-gray-600">Professional billing functionality would be implemented here with invoice creation, customer management, and payment tracking.</p>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
      <p className="text-gray-600">Comprehensive reporting dashboard with sales analytics, revenue trends, and business intelligence would be implemented here.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="mr-3 h-8 w-8 text-blue-600" />
                Shreeram Marketing - Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Complete administrative control panel</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex space-x-4 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'billing', label: 'Billing', icon: FileText },
              { id: 'reports', label: 'Reports', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as any)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  activeSection === id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'inventory' && renderInventory()}
        {activeSection === 'billing' && renderBilling()}
        {activeSection === 'reports' && renderReports()}
      </div>
    </div>
  );
};

export default Admin;
