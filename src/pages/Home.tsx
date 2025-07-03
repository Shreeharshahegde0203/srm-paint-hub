
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  FileText, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Shield,
  Palette,
  Award,
  CheckCircle,
  Eye,
  Zap,
  Target
} from 'lucide-react';
import { useTheme } from 'next-themes';

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-20"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-teal-500 rounded-full opacity-15"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-25"></div>
        <div className="absolute top-60 right-1/3 w-28 h-28 bg-gray-400 rounded-full opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-4">
              <span className="text-2xl font-bold text-white">SM</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            SHREERAM MARKETING
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-200">
            Premium Paints & Coatings Dealer
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Transform your spaces with the finest quality paints from India's most trusted brands. Experience excellence in color, durability, and finish.
          </p>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Visit Store
          </button>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-300">
              Complete paint solutions with expert guidance and quality assurance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-700 rounded-xl p-8 text-center hover:bg-slate-600 transition-colors">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium Paint Collection</h3>
              <p className="text-gray-300 text-sm">
                Extensive range of Dulux and Indigo premium paints including emulsion, exterior, and specialty coatings.
              </p>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-8 text-center hover:bg-slate-600 transition-colors">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Consultation</h3>
              <p className="text-gray-300 text-sm">
                Professional color matching and paint selection guidance from our experienced team.
              </p>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-8 text-center hover:bg-slate-600 transition-colors">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Assurance</h3>
              <p className="text-gray-300 text-sm">
                Authentic products with manufacturer warranty and comprehensive after-sales support.
              </p>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-8 text-center hover:bg-slate-600 transition-colors">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Custom Solutions</h3>
              <p className="text-gray-300 text-sm">
                Tailored paint solutions for residential, commercial, and industrial projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Paint Solutions */}
      <div className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Digital Paint Solutions</h2>
            <p className="text-xl text-gray-300">
              Modern inventory and billing system for seamless operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-700 rounded-xl p-8 hover:bg-slate-600 transition-colors">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Product Catalog</h3>
              <p className="text-gray-300 mb-6">
                Browse our complete collection of Dulux and Indigo paints with real-time stock information and detailed specifications.
              </p>
              <Link 
                to="/product-catalog"
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
              >
                View Products →
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-8 hover:from-orange-500 hover:to-red-500 transition-colors">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Quick Billing</h3>
              <p className="text-white/90 mb-6">
                Fast and accurate billing system with GST compliance. Generate professional invoices instantly.
              </p>
              <Link 
                to="/billing"
                className="text-white/90 hover:text-white font-medium flex items-center"
              >
                Create Invoice →
              </Link>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-8 hover:bg-slate-600 transition-colors">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Business Analytics</h3>
              <p className="text-gray-300 mb-6">
                Comprehensive reports and insights to track sales performance and inventory levels.
              </p>
              <Link 
                to="/reports"
                className="text-green-400 hover:text-green-300 font-medium flex items-center"
              >
                View Reports →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Authorized Dealer Section */}
      <div className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Authorized Dealer</h2>
            <p className="text-xl text-gray-300">
              Official partner for India's premium paint brands
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-slate-700 rounded-xl p-8 text-center">
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/d7d318f5-963c-4ba4-9a1b-fa0bea2b1cc1.png" 
                  alt="Dulux Paints" 
                  className="h-20 mx-auto rounded"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Dulux Paints</h3>
              <p className="text-gray-300">
                Premium quality paints with superior finish and durability
              </p>
            </div>
            
            <div className="bg-slate-700 rounded-xl p-8 text-center">
              <div className="mb-6 flex items-center justify-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">INDIGO</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Indigo Paints</h3>
              <p className="text-gray-300">
                Innovative paint solutions with exceptional color range
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-xl mb-8 text-white/90">
            Visit our store for expert advice and the finest quality paints from Dulux and Indigo
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Visit Our Store
            </Link>
            <Link
              to="/product-catalog"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
