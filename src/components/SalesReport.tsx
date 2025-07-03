
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

const SalesReport = () => {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalInvoices: 0,
    averageOrderValue: 0,
    paidInvoices: 0,
    pendingAmount: 0,
    monthlyGrowth: 0
  });

  const [chartData, setChartData] = useState({
    monthlySales: [],
    productSales: [],
    customerSales: [],
    dailySales: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealTimeSalesData();
  }, []);

  const fetchRealTimeSalesData = async () => {
    try {
      setLoading(true);

      // Fetch all invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*');
      
      if (invoicesError) throw invoicesError;

      // Fetch invoice items with product details
      const { data: invoiceItems, error: itemsError } = await supabase
        .from('invoice_items')
        .select(`
          *,
          products:product_id (name, brand, type),
          invoices:invoice_id (created_at, status, total)
        `);
      
      if (itemsError) throw itemsError;

      // Fetch customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*');
      
      if (customersError) throw customersError;

      // Calculate basic metrics
      const totalSales = invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;
      const paidInvoices = invoices?.filter(inv => inv.status === 'paid').length || 0;
      const paidAmount = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + Number(inv.total), 0) || 0;
      const pendingAmount = totalSales - paidAmount;
      const averageOrderValue = invoices?.length > 0 ? totalSales / invoices.length : 0;

      // Monthly sales data (last 6 months)
      const monthlyData = [];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const monthSales = invoices?.filter(inv => {
          const invoiceDate = new Date(inv.created_at);
          return invoiceDate.getMonth() === date.getMonth() && 
                 invoiceDate.getFullYear() === date.getFullYear();
        }).reduce((sum, inv) => sum + Number(inv.total), 0) || 0;
        
        monthlyData.push({
          month: monthName,
          sales: monthSales,
          invoices: invoices?.filter(inv => {
            const invoiceDate = new Date(inv.created_at);
            return invoiceDate.getMonth() === date.getMonth() && 
                   invoiceDate.getFullYear() === date.getFullYear();
          }).length || 0
        });
      }

      // Product-wise sales
      const productSalesMap = new Map();
      invoiceItems?.forEach(item => {
        if (item.products && item.invoices?.status === 'paid') {
          const productName = item.products.name;
          const currentSales = productSalesMap.get(productName) || 0;
          productSalesMap.set(productName, currentSales + (item.quantity * item.price));
        }
      });

      const productSalesData = Array.from(productSalesMap.entries())
        .map(([product, sales]) => ({ product, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10);

      // Daily sales (last 30 days)
      const dailyData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        const daySales = invoices?.filter(inv => {
          const invoiceDate = new Date(inv.created_at);
          return invoiceDate.toDateString() === date.toDateString();
        }).reduce((sum, inv) => sum + Number(inv.total), 0) || 0;
        
        dailyData.push({
          date: date.getDate().toString(),
          sales: daySales
        });
      }

      // Customer analysis
      const customerSalesMap = new Map();
      invoices?.forEach(inv => {
        if (inv.status === 'paid' && inv.customer_id) {
          const customer = customers?.find(c => c.id === inv.customer_id);
          if (customer) {
            const currentSales = customerSalesMap.get(customer.name) || 0;
            customerSalesMap.set(customer.name, currentSales + Number(inv.total));
          }
        }
      });

      const customerSalesData = Array.from(customerSalesMap.entries())
        .map(([customer, sales]) => ({ customer, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      setSalesData({
        totalSales,
        totalInvoices: invoices?.length || 0,
        averageOrderValue,
        paidInvoices,
        pendingAmount,
        monthlyGrowth: monthlyData.length > 1 ? 
          ((monthlyData[monthlyData.length - 1].sales - monthlyData[monthlyData.length - 2].sales) / 
           (monthlyData[monthlyData.length - 2].sales || 1)) * 100 : 0
      });

      setChartData({
        monthlySales: monthlyData,
        productSales: productSalesData,
        customerSales: customerSalesData,
        dailySales: dailyData
      });

    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Sales</p>
              <p className="text-2xl font-bold">₹{salesData.totalSales.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Invoices</p>
              <p className="text-2xl font-bold">{salesData.totalInvoices}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Avg Order Value</p>
              <p className="text-2xl font-bold">₹{salesData.averageOrderValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100">Paid Invoices</p>
              <p className="text-2xl font-bold">{salesData.paidInvoices}</p>
            </div>
            <Package className="h-8 w-8 text-teal-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Pending Amount</p>
              <p className="text-2xl font-bold">₹{salesData.pendingAmount.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Monthly Growth</p>
              <p className="text-2xl font-bold">{salesData.monthlyGrowth.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
              <Area type="monotone" dataKey="sales" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Sales */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Sales (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
              <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.productSales} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="product" type="category" width={100} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
              <Bar dataKey="sales" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Customers */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.customerSales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ customer, value }) => `${customer}: ₹${value.toLocaleString()}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="sales"
              >
                {chartData.customerSales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Forecasting */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Insights & Forecasting</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Revenue Forecast</h4>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              ₹{(salesData.totalSales * 1.15).toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">Projected next month (+15%)</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Collection Rate</h4>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {salesData.totalSales > 0 ? ((salesData.totalSales - salesData.pendingAmount) / salesData.totalSales * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm text-green-600">Payment collection efficiency</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Growth Trend</h4>
            <p className="text-2xl font-bold text-purple-600 mb-1">
              {salesData.monthlyGrowth > 0 ? '+' : ''}{salesData.monthlyGrowth.toFixed(1)}%
            </p>
            <p className="text-sm text-purple-600">Month-over-month growth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
