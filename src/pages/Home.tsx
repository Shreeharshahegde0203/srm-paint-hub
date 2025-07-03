
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
  Target,
  Star,
  ArrowRight
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Logo from '../components/Logo';

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-teal-500 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute top-60 right-1/3 w-28 h-28 bg-gray-400 rounded-full opacity-20 animate-pulse"></div>
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          {/* Animated Logo */}
          <div className="mb-8 animate-scale-in">
            <div className="inline-flex items-center justify-center mb-4 transform hover:scale-110 transition-transform duration-300">
              <Logo className="h-24 w-auto" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            SHREERAM MARKETING
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Premium Paints & Coatings Dealer
          </p>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Transform your spaces with the finest quality paints from India's most trusted brands. Experience excellence in color, durability, and finish.
          </p>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25">
              Visit Store
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Services Section with Enhanced Animation */}
      <div className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat bg-[length:60px_60px]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-xl text-gray-300">
              Complete paint solutions with expert guidance and quality assurance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Palette,
                title: "Premium Paint Collection",
                description: "Extensive range of Dulux and Indigo premium paints including emulsion, exterior, and specialty coatings.",
                color: "from-orange-500 to-red-500",
                delay: "0.1s"
              },
              {
                icon: Users,
                title: "Expert Consultation",
                description: "Professional color matching and paint selection guidance from our experienced team.",
                color: "from-blue-500 to-cyan-500",
                delay: "0.2s"
              },
              {
                icon: Award,
                title: "Quality Assurance",
                description: "Authentic products with manufacturer warranty and comprehensive after-sales support.",
                color: "from-purple-500 to-pink-500",
                delay: "0.3s"
              },
              {
                icon: Target,
                title: "Custom Solutions",
                description: "Tailored paint solutions for residential, commercial, and industrial projects.",
                color: "from-teal-500 to-green-500",
                delay: "0.4s"
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="group bg-slate-700/50 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-slate-600/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in border border-white/10"
                style={{ animationDelay: service.delay }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Digital Solutions Section */}
      <div className="py-20 bg-gradient-to-b from-slate-900 to-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Digital Paint Solutions
            </h2>
            <p className="text-xl text-gray-300">
              Modern inventory and billing system for seamless operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Product Catalog",
                description: "Browse our complete collection of Dulux and Indigo paints with real-time stock information and detailed specifications.",
                link: "/product-catalog",
                linkText: "View Products →",
                gradient: "from-blue-600 to-purple-600",
                delay: "0.1s"
              },
              {
                icon: FileText,
                title: "Quick Billing",
                description: "Fast and accurate billing system with GST compliance. Generate professional invoices instantly.",
                link: "/billing",
                linkText: "Create Invoice →",
                gradient: "from-orange-600 to-red-600",
                featured: true,
                delay: "0.2s"
              },
              {
                icon: BarChart3,
                title: "Business Analytics",
                description: "Comprehensive reports and insights to track sales performance and inventory levels.",
                link: "/reports",
                linkText: "View Reports →",
                gradient: "from-green-600 to-teal-600",
                delay: "0.3s"
              }
            ].map((solution, index) => (
              <div 
                key={index}
                className={`group rounded-xl p-8 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in ${
                  solution.featured 
                    ? `bg-gradient-to-br ${solution.gradient} shadow-2xl hover:shadow-orange-500/25` 
                    : 'bg-slate-700/50 backdrop-blur-sm border border-white/10 hover:bg-slate-600/50'
                }`}
                style={{ animationDelay: solution.delay }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 ${
                  solution.featured ? 'bg-white/20' : `bg-gradient-to-r ${solution.gradient}`
                }`}>
                  <solution.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-300 transition-colors">
                  {solution.title}
                </h3>
                <p className={`mb-6 transition-colors ${
                  solution.featured ? 'text-white/90' : 'text-gray-300 group-hover:text-gray-200'
                }`}>
                  {solution.description}
                </p>
                <Link 
                  to={solution.link}
                  className={`font-medium flex items-center group-hover:translate-x-2 transition-transform duration-300 ${
                    solution.featured 
                      ? 'text-white/90 hover:text-white' 
                      : 'text-blue-400 hover:text-blue-300'
                  }`}
                >
                  {solution.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authorized Dealer Section */}
      <div className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Authorized Dealer
            </h2>
            <p className="text-xl text-gray-300">
              Official partner for India's premium paint brands
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="group bg-slate-700/50 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-500 hover:bg-slate-600/50 transform hover:scale-105 animate-fade-in border border-white/10">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/lovable-uploads/d7d318f5-963c-4ba4-9a1b-fa0bea2b1cc1.png" 
                  alt="Dulux Paints" 
                  className="h-20 mx-auto rounded shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-300 transition-colors">
                Dulux Paints
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                Premium quality paints with superior finish and durability
              </p>
            </div>
            
            <div className="group bg-slate-700/50 backdrop-blur-sm rounded-xl p-8 text-center transition-all duration-500 hover:bg-slate-600/50 transform hover:scale-105 animate-fade-in border border-white/10" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">INDIGO</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 group-hover:text-orange-300 transition-colors">
                Indigo Paints
              </h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                Innovative paint solutions with exceptional color range
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Visit our store for expert advice and the finest quality paints from Dulux and Indigo
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/contact"
              className="group bg-white text-red-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center"
            >
              Visit Our Store
              <Star className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link
              to="/product-catalog"
              className="group border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center"
            >
              Get Quote
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
