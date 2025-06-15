import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Package, Users, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Calendar } from '../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Helper: Group and sum by key
function groupBy(arr, key) {
  return arr.reduce((result, item) => {
    const groupKey = item[key] || 'Unknown';
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(item);
    return result;
  }, {});
}

const Reports = () => {
  const { products, isLoading: productsLoading, error: productsError } = useSupabaseProducts();

  // Invoices
  const { data: invoicesData, isLoading: invoicesLoading, error: invoicesError } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoices').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Invoice Items
  const { data: invoiceItemsData, isLoading: invoiceItemsLoading, error: invoiceItemsError } = useQuery({
    queryKey: ['invoice_items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoice_items').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Customers
  const { data: customersData, isLoading: customersLoading, error: customersError } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('customers').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Fix: Type all loaded data 
  const typedInvoices = (invoicesData ?? []) as Tables<"invoices">[];
  const typedInvoiceItems = (invoiceItemsData ?? []) as Tables<"invoice_items">[];
  const typedProducts = (products ?? []) as Tables<"products">[];
  const typedCustomers = (customersData ?? []) as Tables<"customers">[];

  // Add state for calendar popover & selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Filter invoices by selected date, if any; otherwise show all
  const filteredInvoices = useMemo(() => {
    if (!selectedDate) return typedInvoices;
    const dateStr = selectedDate.toISOString().split('T')[0];
    return typedInvoices.filter(inv =>
      inv.created_at && inv.created_at.startsWith(dateStr)
    );
  }, [typedInvoices, selectedDate]);

  // Loading/Error state
  const loading = productsLoading || invoicesLoading || invoiceItemsLoading || customersLoading;
  const error = productsError || invoicesError || invoiceItemsError || customersError;

  // Data Computation
  const statistics = useMemo(() => {
    // Use typed arrays everywhere
    if (!filteredInvoices.length || !typedInvoiceItems.length || !typedProducts.length) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        productsSold: 0,
        activeCustomers: 0,
        lowStockItems: [],
        topProducts: [],
        recentCustomers: [],
        productTypeShare: [],
        salesData: [],
      };
    }

    // Revenue, products sold, orders
    const totalRevenue = filteredInvoices.reduce(
      (sum, inv) => sum + Number(inv.total ?? 0), 
      0
    );
    const totalOrders = filteredInvoices.length;
    const productsSold = typedInvoiceItems.reduce(
      (sum, item) => sum + Number(item.quantity ?? 0), 
      0
    );
    const activeCustomerIds = Array.from(
      new Set(filteredInvoices.map(i => i.customer_id).filter(Boolean))
    );
    const activeCustomers = activeCustomerIds.length;

    // Low stock: products below threshold (20 units)
    const lowStockItems = typedProducts.filter(
      p => typeof p.stock === "number" && p.stock <= 20
    );

    // Top selling products (by quantity)
    const productSales: Record<string, number> = {};
    typedInvoiceItems.forEach(item => {
      if (!item.product_id) return;
      productSales[item.product_id] = 
        (productSales[item.product_id] ?? 0) + Number(item.quantity ?? 0);
    });

    const productRevenues: Record<string, number> = {};
    typedInvoiceItems.forEach(item => {
      if (!item.product_id) return;
      const revenue = Number(item.price ?? 0) * Number(item.quantity ?? 0);
      productRevenues[item.product_id] = 
        (productRevenues[item.product_id] ?? 0) + revenue;
    });

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([productId, sold]) => {
        const product = typedProducts.find(p => p.id === productId);
        return {
          name: product?.name ?? 'Unknown Product',
          sales: sold,
          revenue: productRevenues[productId] ?? 0,
        };
      });

    // Recent customers (last 3 by order)
    const recentCustomersSet: Record<string, boolean> = {};
    const recentInvoices = [...filteredInvoices]
      .sort((a, b) =>
        (b.created_at ? new Date(b.created_at).getTime() : 0) -
        (a.created_at ? new Date(a.created_at).getTime() : 0)
      )
      .filter(inv => inv.customer_id)
      .slice(0, 10);

    const recentCustomersArr: {
      name: string; orders: number; totalSpent: number; lastOrder: string;
    }[] = [];
    for (const inv of recentInvoices) {
      if (!inv.customer_id) continue;
      if (recentCustomersSet[inv.customer_id]) continue;
      recentCustomersSet[inv.customer_id] = true;
      const cust = typedCustomers.find(c => c.id === inv.customer_id);
      const customerInvoiceItems = typedInvoiceItems.filter(i => i.invoice_id === inv.id);
      const totalSpent = customerInvoiceItems.reduce(
        (sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 0), 
        0
      );
      recentCustomersArr.push({
        name: cust?.name ?? 'Unknown Customer',
        orders: filteredInvoices.filter(i => i.customer_id === cust?.id).length,
        totalSpent,
        lastOrder: inv.created_at ? inv.created_at.split('T')[0] : '',
      });
      if (recentCustomersArr.length >= 3) break;
    }

    // Product type share (Pie Chart)
    const typeGroups = groupBy(typedProducts, "type");
    const totalTypeSales: Record<string, number> = {};
    Object.entries(typeGroups).forEach(([type, prods]) => {
      totalTypeSales[type] = Array.isArray(prods)
        ? prods.reduce(
          (sum, p) => sum + (p && typeof p === 'object' && 'id' in p ? (productSales[p.id] ?? 0) : 0),
          0
        )
        : 0;
    });
    const typeColors = ['#1e3a8a', '#dc2626', '#16a34a', '#f59e0b', '#e11d48'];
    const productTypeShare = Object.entries(typeGroups).map(([type, prods], i) => ({
      name: type,
      value: totalTypeSales[type],
      color: typeColors[i % typeColors.length],
    }));

    // Sales Data for Bar Chart (last 7 days)
    const today = new Date();
    const pastWeek = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const salesData = pastWeek.map((date) => {
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon, Tue
      const dayInvoices = filteredInvoices.filter(inv => {
        if (!inv.created_at) return false;
        const invDate = new Date(inv.created_at);
        return invDate.toDateString() === date.toDateString();
      });
      const daySales = dayInvoices.reduce((sum, inv) => sum + Number(inv.total ?? 0), 0);
      const dayOrders = dayInvoices.length;
      return { name: dayStr, sales: daySales, orders: dayOrders };
    });

    return {
      totalRevenue,
      totalOrders,
      productsSold,
      activeCustomers,
      lowStockItems,
      topProducts,
      recentCustomers: recentCustomersArr,
      productTypeShare,
      salesData,
    };
  }, [filteredInvoices, typedInvoiceItems, typedProducts, typedCustomers]);

  const StatCard = ({ title, value, icon, color, change }: any) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change != null && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : (change < 0 ? 'text-red-600' : '')}`}>
              {change > 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BarChart className="mr-3 h-8 w-8 text-purple-600" />
                Reports & Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Business insights and performance metrics</p>
            </div>
            {/* New: Calendar Icon Popover for date selection */}
            <div className="flex items-center gap-4">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none"
                  >
                    <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                    <span>
                      {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : "All Time"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-50"
                  align="end"
                  style={{ minWidth: 0 }}
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate ?? undefined}
                    onSelect={date => {
                      setSelectedDate(date ?? null);
                      setPopoverOpen(false);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <button
                  className="ml-2 px-2 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-100 rounded text-sm"
                  onClick={() => setSelectedDate(null)}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-4 text-center text-gray-500 p-8">Loading data...</div>
          </div>
        ) : error ? (
          <div className="col-span-4 text-center text-red-500 p-8">Error loading data.</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${statistics.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value={statistics.totalOrders}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Products Sold"
            value={statistics.productsSold}
            icon={<Package className="h-6 w-6 text-white" />}
            color="bg-purple-500"
          />
          <StatCard
            title="Active Customers"
            value={statistics.activeCustomers}
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-orange-500"
          />
        </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Daily Sales</h3>
            {loading ? (
              <div className="text-center text-gray-500 p-10">Loading chart...</div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any, name: string) => [
                  name === 'sales' ? `₹${value}` : value,
                  name === 'sales' ? 'Sales' : 'Orders'
                ] as [string, string]} />
                <Bar dataKey="sales" fill="#1e3a8a" />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>

          {/* Product Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sales by Product Type</h3>
            {loading ? (
              <div className="text-center text-gray-500 p-10">Loading chart...</div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statistics.productTypeShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {statistics.productTypeShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Units Sold']} />
              </PieChart>
            </ResponsiveContainer>
            )}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statistics.productTypeShare.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Selling Products</h3>
            {loading ? (
              <div className="text-center text-gray-500 p-10">Loading...</div>
            ) : (
            <div className="space-y-4">
              {statistics.topProducts.length > 0 ? statistics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">₹{product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Revenue</p>
                  </div>
                </div>
              )) : <div className="text-gray-400 text-center">No product sales yet.</div>}
            </div>
            )}
          </div>

          {/* Recent Customers */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Customers</h3>
            {loading ? (
              <div className="text-center text-gray-500 p-10">Loading...</div>
            ) : (
            <div className="space-y-4">
              {statistics.recentCustomers.length > 0 ? statistics.recentCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{customer.orders} orders • Last: {customer.lastOrder}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">₹{customer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Spent</p>
                  </div>
                </div>
              )) : <div className="text-gray-400 text-center">No customer data yet.</div>}
            </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Low Stock Alerts</h3>
          </div>
          {loading ? (
            <div className="text-center text-gray-500 p-10">Loading...</div>
          ) : statistics.lowStockItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statistics.lowStockItems.map((item, index) => (
              <div key={index} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{item.name}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600 dark:text-red-400">Current: {item.stock} units</span>
                  <span className="text-gray-600 dark:text-gray-300">Min: 20 units</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${(item.stock / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-gray-400 text-center">All products sufficiently stocked.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
