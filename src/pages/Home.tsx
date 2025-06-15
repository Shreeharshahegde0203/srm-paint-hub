
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, FileText, BarChart3, Shield } from 'lucide-react';
import Logo from '../components/Logo';

const Home = () => {
  const services = [
    {
      icon: <Palette className="h-12 w-12 text-orange-600" />,
      title: 'Premium Paint Collection',
      description: 'Wide range of high-quality paints including oil-based, emulsion, and specialty coatings for all your needs.',
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-600" />,
      title: 'Professional Service',
      description: 'Expert consultation and color matching services to help you choose the perfect paint for your project.',
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-green-600" />,
      title: 'Bulk Orders',
      description: 'Competitive pricing for contractors and bulk orders with flexible payment terms.',
    },
    {
      icon: <Shield className="h-12 w-12 text-purple-600" />,
      title: 'Quality Guarantee',
      description: 'All our products come with quality assurance and after-sales support.',
    },
  ];

  const brands = [
    'Asian Paints', 'Berger Paints', 'Dulux', 'Nerolac', 'Jotun', 'Shalimar Paints'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with improved colors */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated paint splashes background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-red-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-yellow-500 rounded-full opacity-10 animate-pulse delay-3000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo className="h-24" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent">
              Shreeram Marketing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-200">
              Your Trusted Partner for Premium Paints & Coatings
            </p>
            <p className="text-lg mb-12 text-slate-300 max-w-3xl mx-auto">
              Experience excellence in paint retail with our comprehensive inventory management, 
              professional billing system, and unmatched customer service since establishment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/inventory"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Inventory <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        
        {/* Modern wave bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-24" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z" fill="rgb(248 250 252)"></path>
          </svg>
        </div>
      </section>

      {/* Services Section with improved styling */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive paint solutions with modern management systems
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border border-slate-100"
              >
                <div className="flex justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Features with enhanced design */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Modern Management System
            </h2>
            <p className="text-xl text-slate-600">
              Streamlined operations with digital inventory and billing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Link
              to="/inventory"
              className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 border border-blue-200 hover:shadow-lg"
            >
              <div className="text-blue-600 mb-4">
                <Palette className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                Inventory Management
              </h3>
              <p className="text-blue-800 mb-4">
                Track stock levels, manage products, filter by brand and type. Real-time inventory updates with low stock alerts.
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-800">
                <span className="font-semibold">Manage Inventory</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/billing"
              className="group bg-gradient-to-br from-orange-50 to-red-100 p-8 rounded-2xl hover:from-orange-100 hover:to-red-200 transition-all duration-300 border border-orange-200 hover:shadow-lg"
            >
              <div className="text-orange-600 mb-4">
                <FileText className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-3">
                Professional Billing
              </h3>
              <p className="text-red-800 mb-4">
                Create GST compliant invoices, manage customer data, auto-calculate taxes. Professional PDF generation for Indian businesses.
              </p>
              <div className="flex items-center text-orange-600 group-hover:text-red-800">
                <span className="font-semibold">Create Bills</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/reports"
              className="group bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl hover:from-green-100 hover:to-emerald-200 transition-all duration-300 border border-green-200 hover:shadow-lg"
            >
              <div className="text-green-600 mb-4">
                <BarChart3 className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-3">
                Reports & Analytics
              </h3>
              <p className="text-green-800 mb-4">
                Sales reports, low stock alerts, customer analytics. Make data-driven business decisions with comprehensive insights.
              </p>
              <div className="flex items-center text-green-600 group-hover:text-green-800">
                <span className="font-semibold">View Reports</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section with improved styling */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Authorized Dealer
            </h2>
            <p className="text-xl text-slate-300">
              We stock premium brands you trust
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-slate-700 p-6 rounded-xl text-center hover:bg-slate-600 transition-all duration-300 hover:scale-105 border border-slate-600"
              >
                <span className="text-white font-semibold text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Visit our store or contact us for expert advice on your next painting project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Directions
            </Link>
            <Link
              to="/billing"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Quick Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
