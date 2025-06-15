
import React, { useMemo } from "react";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, Package, Users } from "lucide-react";
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ProductShowcaseCard from "../components/ProductShowcaseCard";
import { productsDatabase } from '../data/products';

const Home = () => {
  const { products: dbProducts, isLoading: productsLoading } = useSupabaseProducts();
  const { data: invoicesData = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoices').select('*');
      if (error) throw error;
      return data;
    },
  });
  const { data: invoiceItemsData = [] } = useQuery({
    queryKey: ['invoice_items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoice_items').select('*');
      if (error) throw error;
      return data;
    },
  });

  // Safely use up to 6 featured products from DB, fallback to static data if empty
  const featuredProducts = useMemo(() => {
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.slice(0, 6).map(prod => ({
        ...prod,
        gstRate: prod.gst_rate ?? 18,
        description: prod.description ?? "",
        code: prod.code ?? "",
        stock: prod.stock ?? 0,
        type: prod.type ?? "",
        color: prod.color ?? "",
        brand: prod.brand ?? "",
        name: prod.name ?? "",
        image: prod.image ?? ""
      }));
    }
    // fallback sample
    return productsDatabase.slice(0, 6);
  }, [dbProducts]);

  const totalRevenue = useMemo(() =>
    invoicesData.reduce((sum, inv) => sum + Number(inv.total ?? 0), 0)
  , [invoicesData]);
  const totalOrders = invoicesData.length;
  const productsSold = invoiceItemsData.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);

  // Distinct customer IDs
  const uniqueCustomers = Array.from(new Set(invoicesData.map(inv => inv.customer_id))).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-0">
      {/* Hero Section */}
      <section className="w-full pt-6 pb-4 bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <Logo className="h-20 mb-2" />
          <h1 className="text-3xl sm:text-5xl font-bold text-blue-900 dark:text-yellow-400 drop-shadow mt-4">ShreeRam Marketing</h1>
          <h2 className="text-lg sm:text-2xl text-slate-700 dark:text-yellow-200 mt-2 font-semibold">Premium Dulux & Indigo Paints, Supplies & Solutions</h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 text-center mt-3 max-w-2xl">Your trusted one-stop solution for all interior & exterior painting needs in Maharashtra since 2011.</p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-2 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h3 className="text-xl font-bold text-blue-900 dark:text-white">Featured Products</h3>
          <Link to="/inventory" className="text-blue-700 hover:underline flex items-center gap-1 font-medium dark:text-yellow-300">
            See all products
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, idx) => (
            <ProductShowcaseCard key={product.code || product.id || idx} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* Analytics Cards */}
      <section className="max-w-7xl mx-auto pt-0 pb-14 px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col">
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-600" />
              <span className="text-lg font-bold text-gray-700 dark:text-white">
                ₹{totalRevenue.toLocaleString()}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-300 text-sm mt-1">
              Total Revenue
            </span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              <span className="text-lg font-bold text-gray-700 dark:text-white">
                {totalOrders}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-300 text-sm mt-1">
              Orders
            </span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col">
            <div className="flex items-center gap-2">
              <Package className="text-purple-600" />
              <span className="text-lg font-bold text-gray-700 dark:text-white">
                {productsSold}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-300 text-sm mt-1">
              Products Sold
            </span>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col">
            <div className="flex items-center gap-2">
              <Users className="text-orange-500" />
              <span className="text-lg font-bold text-gray-700 dark:text-white">
                {uniqueCustomers}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-300 text-sm mt-1">
              Customers
            </span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-gradient-to-t from-blue-100 to-white dark:from-slate-900 dark:to-slate-800 py-8 mt-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4">
          <h4 className="font-bold text-blue-900 dark:text-white text-lg">Looking for custom solutions, bulk orders, or expert advice?</h4>
          <Link to="/contact" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors text-lg">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
