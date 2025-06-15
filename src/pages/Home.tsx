
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, FileText, Shield, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';

const Home = () => {
  const services = [
    {
      icon: <Palette className="h-12 w-12 text-orange-600" />,
      title: 'Premium Paint Collection',
      description: 'Extensive range of Dulux and Indigo premium paints including emulsion, exterior, and specialty coatings.',
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-600" />,
      title: 'Expert Consultation',
      description: 'Professional color matching and paint selection guidance from our experienced team.',
    },
    {
      icon: <Shield className="h-12 w-12 text-purple-600" />,
      title: 'Quality Assurance',
      description: 'Authentic products with manufacturer warranty and comprehensive after-sales support.',
    },
    {
      icon: <Sparkles className="h-12 w-12 text-green-600" />,
      title: 'Custom Solutions',
      description: 'Tailored paint solutions for residential, commercial, and industrial projects.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated paint splashes with enhanced animations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-red-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-yellow-500 rounded-full opacity-10 animate-pulse delay-3000"></div>
          {/* New floating elements */}
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-10 animate-bounce delay-500"></div>
          <div className="absolute top-3/4 right-1/3 w-12 h-12 bg-purple-400 rounded-full opacity-10 animate-bounce delay-1500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8 transform hover:scale-105 transition-transform duration-300">
              <Logo className="h-24" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent animate-fade-in">
              Shreeram Marketing
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-200 animate-fade-in delay-300">
              Authorized Dealer for Dulux & Indigo Premium Paints
            </p>
            <p className="text-lg mb-12 text-slate-300 max-w-3xl mx-auto animate-fade-in delay-500">
              Transform your spaces with the finest quality paints from India's most trusted brands. 
              Experience excellence in color, durability, and finish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-700">
              <Link
                to="/inventory"
                className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105"
              >
                Explore Products 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="group bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                Visit Store
              </Link>
            </div>
          </div>
        </div>
        
        {/* Enhanced wave bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-24" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z" fill="rgb(248 250 252)"></path>
          </svg>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 animate-fade-in">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-fade-in delay-200">
              Complete paint solutions with expert guidance and quality assurance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-6 border border-slate-100 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center group-hover:text-blue-600 transition-colors">
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

      {/* Enhanced Management Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 animate-fade-in">
              Digital Paint Solutions
            </h2>
            <p className="text-xl text-slate-600 animate-fade-in delay-200">
              Modern inventory and billing system for seamless operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Link
              to="/inventory"
              className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl hover:from-blue-100 hover:to-indigo-200 transition-all duration-500 border border-blue-200 hover:shadow-2xl transform hover:-translate-y-3 animate-fade-in"
            >
              <div className="text-blue-600 mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Palette className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-3 group-hover:text-blue-700 transition-colors">
                Product Catalog
              </h3>
              <p className="text-blue-800 mb-4">
                Browse our complete collection of Dulux and Indigo paints with real-time stock information and detailed specifications.
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-800 transition-colors">
                <span className="font-semibold">View Products</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link
              to="/billing"
              className="group bg-gradient-to-br from-orange-50 to-red-100 p-8 rounded-2xl hover:from-orange-100 hover:to-red-200 transition-all duration-500 border border-orange-200 hover:shadow-2xl transform hover:-translate-y-3 animate-fade-in delay-200"
            >
              <div className="text-orange-600 mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <FileText className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-3 group-hover:text-red-700 transition-colors">
                Quick Billing
              </h3>
              <p className="text-red-800 mb-4">
                Fast and accurate billing system with GST compliance. Generate professional invoices instantly.
              </p>
              <div className="flex items-center text-orange-600 group-hover:text-red-800 transition-colors">
                <span className="font-semibold">Create Invoice</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>

            <Link
              to="/reports"
              className="group bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl hover:from-green-100 hover:to-emerald-200 transition-all duration-500 border border-green-200 hover:shadow-2xl transform hover:-translate-y-3 animate-fade-in delay-400"
            >
              <div className="text-green-600 mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Shield className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">
                Business Analytics
              </h3>
              <p className="text-green-800 mb-4">
                Comprehensive reports and insights to track sales performance and inventory levels.
              </p>
              <div className="flex items-center text-green-600 group-hover:text-green-800 transition-colors">
                <span className="font-semibold">View Reports</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Authorized Dealer Section with Brand Logos */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
              Authorized Dealer
            </h2>
            <p className="text-xl text-slate-300 animate-fade-in delay-200">
              Official partner for India's premium paint brands
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Dulux Brand */}
            <div className="group bg-slate-700 p-12 rounded-2xl text-center hover:bg-slate-600 transition-all duration-500 hover:scale-105 border border-slate-600 cursor-pointer animate-fade-in">
              <div className="bg-white p-8 rounded-xl mb-6 mx-auto w-32 h-32 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-slate-800">DULUX</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-300 transition-colors">Dulux Paints</h3>
              <p className="text-slate-300 group-hover:text-white transition-colors">Premium quality paints with superior finish and durability</p>
            </div>

            {/* Indigo Brand */}
            <div className="group bg-slate-700 p-12 rounded-2xl text-center hover:bg-slate-600 transition-all duration-500 hover:scale-105 border border-slate-600 cursor-pointer animate-fade-in delay-200">
              <div className="bg-white p-8 rounded-xl mb-6 mx-auto w-32 h-32 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-indigo-800">INDIGO</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">Indigo Paints</h3>
              <p className="text-slate-300 group-hover:text-white transition-colors">Innovative paint solutions with exceptional color range</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 text-orange-100 animate-fade-in delay-200">
            Visit our store for expert advice and the finest quality paints from Dulux and Indigo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="group bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 animate-fade-in delay-400"
            >
              Visit Our Store
            </Link>
            <Link
              to="/billing"
              className="group bg-transparent border-2 border-white hover:bg-white hover:text-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 animate-fade-in delay-600"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
