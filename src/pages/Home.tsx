
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, ShoppingCart, Users, BarChart3, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';
import { productsDatabase } from '../data/products';
import ProductShowcaseCard from '../components/ProductShowcaseCard';

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Show first 3 products as showcase
  const showcaseProducts = productsDatabase.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-blue-600">Shreeram</span> Marketing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your trusted partner for premium paints and professional paint solutions. 
              Experience quality, reliability, and excellence in every drop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/product-catalog"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                to="/contact"
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center transition-colors">
              <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Premium Products</h3>
              <p className="text-gray-600 dark:text-gray-300">
                High-quality paints from trusted brands like Dulux, Asian Paints, and more.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center transition-colors">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Expert Consultation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Professional advice and color consultation for your painting projects.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center transition-colors">
              <ShoppingCart className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Ordering</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simple and efficient ordering process with quick delivery options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseProducts.map((product) => (
              <ProductShowcaseCard 
                key={product.id} 
                product={{
                  ...product,
                  color: product.base || 'Standard',
                  code: `PRD-${product.id.slice(0, 4)}`
                }}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/product-catalog"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center transition-colors">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Business Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Access our comprehensive business management tools for inventory, billing, and analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Shield className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Link>
              <Link
                to="/inventory"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Package className="mr-2 h-5 w-5" />
                Inventory
              </Link>
              <Link
                to="/billing"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <FileText className="mr-2 h-5 w-5" />
                Billing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
