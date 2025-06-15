import React, { useMemo } from "react";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, Package, Users, AlertTriangle } from "lucide-react";
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, FileText, Shield, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import { productsDatabase } from '../data/products';
import FeaturedProductImage from "../components/FeaturedProductImage";
import indigoLogo from "../assets/indigo-logo.svg";
import ProductShowcaseCard from "../components/ProductShowcaseCard";
import { useCompanyInfo } from "../contexts/CompanyInfoContext";

const Home = () => {
  const { products, isLoading: productsLoading } = useSupabaseProducts();
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

  const totalRevenue = useMemo(() =>
    invoicesData.reduce((sum, inv) => sum + Number(inv.total ?? 0), 0)
  , [invoicesData]);
  const totalOrders = invoicesData.length;
  const productsSold = invoiceItemsData.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {Array.from(new Set(invoicesData.map(inv => inv.customer_id))).length}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-300 text-sm mt-1">
              Customers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
