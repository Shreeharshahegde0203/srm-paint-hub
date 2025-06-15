
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, FileText, BarChart3, Shield } from 'lucide-react';
import Logo from '../components/Logo';

const Home = () => {
  const services = [
    {
      icon: <Palette className="h-12 w-12 text-red-600" />,
      title: 'Premium Paint Collection',
      description: 'Wide range of high-quality paints including oil-based, emulsion, and specialty coatings for all your needs.',
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-900" />,
      title: 'Professional Service',
      description: 'Expert consultation and color matching services to help you choose the perfect paint for your project.',
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-red-600" />,
      title: 'Bulk Orders',
      description: 'Competitive pricing for contractors and bulk orders with flexible payment terms.',
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-900" />,
      title: 'Quality Guarantee',
      description: 'All our products come with quality assurance and after-sales support.',
    },
  ];

  const brands = [
    'Asian Paints', 'Berger Paints', 'Dulux', 'Nerolac', 'Jotun', 'Shalimar Paints'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo className="h-20" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Shreeram Marketing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Your Trusted Partner for Premium Paints & Coatings
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-3xl mx-auto">
              Experience excellence in paint retail with our comprehensive inventory management, 
              professional billing system, and unmatched customer service since establishment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/inventory"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                View Inventory <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
        {/* Paint splash decoration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-20" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" fill="rgb(249 250 251)"></path>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive paint solutions with modern management systems
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Modern Management System
            </h2>
            <p className="text-xl text-gray-600">
              Streamlined operations with digital inventory and billing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Link
              to="/inventory"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
            >
              <div className="text-blue-900 mb-4">
                <Palette className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                Inventory Management
              </h3>
              <p className="text-blue-800 mb-4">
                Track stock levels, manage products, filter by brand and type. Real-time inventory updates.
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-800">
                <span className="font-semibold">Manage Inventory</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/billing"
              className="group bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl hover:from-red-100 hover:to-red-200 transition-all duration-300"
            >
              <div className="text-red-600 mb-4">
                <FileText className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-3">
                Billing System
              </h3>
              <p className="text-red-800 mb-4">
                Create professional invoices, manage customer data, apply discounts and calculate taxes automatically.
              </p>
              <div className="flex items-center text-red-600 group-hover:text-red-800">
                <span className="font-semibold">Create Bills</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/reports"
              className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300"
            >
              <div className="text-green-600 mb-4">
                <BarChart3 className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-3">
                Reports & Analytics
              </h3>
              <p className="text-green-800 mb-4">
                Sales reports, low stock alerts, customer analytics. Make data-driven business decisions.
              </p>
              <div className="flex items-center text-green-600 group-hover:text-green-800">
                <span className="font-semibold">View Reports</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Authorized Dealer
            </h2>
            <p className="text-xl text-gray-300">
              We stock premium brands you trust
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
              >
                <span className="text-white font-semibold">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Visit our store or contact us for expert advice on your next painting project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Directions
            </Link>
            <Link
              to="/billing"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
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
