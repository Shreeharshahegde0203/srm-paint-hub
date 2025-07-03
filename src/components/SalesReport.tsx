
import React from 'react';
import { TrendingUp, Calendar, DollarSign, Package, Users, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const SalesReport = () => {
  // Sample data for charts
  const dailySalesData = [
    { day: 'Mon', sales: 12450, items: 45 },
    { day: 'Tue', sales: 15600, items: 52 },
    { day: 'Wed', sales: 9800, items: 38 },
    { day: 'Thu', sales: 18200, items: 67 },
    { day: 'Fri', sales: 21500, items: 78 },
    { day: 'Sat', sales: 16800, items: 59 },
    { day: 'Sun', sales: 8900, items: 32 },
  ];

  const productPerformanceData = [
    { name: 'Asian Paints', sales: 85000, percentage: 35 },
    { name: 'Berger Paints', sales: 65000, percentage: 27 },
    { name: 'Dulux', sales: 45000, percentage: 18 },
    { name: 'Nerolac', sales: 30000, percentage: 12 },
    { name: 'Others', sales: 20000, percentage: 8 },
  ];

  const monthlySalesData = [
    { month: 'Jan', revenue: 385200, customers: 145 },
    { month: 'Feb', revenue: 412800, customers: 162 },
    { month: 'Mar', revenue: 398500, customers: 158 },
    { month: 'Apr', revenue: 445600, customers: 178 },
    { month: 'May', revenue: 467200, customers: 189 },
    { month: 'Jun', revenue: 498300, customers: 201 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="mr-3 h-6 w-6 text-green-600" />
          Sales Analytics & Reports
        </h2>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Today's Sales</p>
              <p className="text-2xl font-bold">₹21,500</p>
              <p className="text-sm text-blue-200">+12% from yesterday</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">This Month</p>
              <p className="text-2xl font-bold">₹4,98,300</p>
              <p className="text-sm text-green-200">+8% from last month</p>
            </div>
            <Calendar className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Items Sold</p>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-purple-200">+15% this week</p>
            </div>
            <Package className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Customers</p>
              <p className="text-2xl font-bold">201</p>
              <p className="text-sm text-orange-200">+6% new customers</p>
            </div>
            <Users className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Sales Trend */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Daily Sales Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? `₹${value}` : value,
                  name === 'sales' ? 'Sales' : 'Items Sold'
                ]}
              />
              <Bar dataKey="sales" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Performance Pie Chart */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Product-wise Sales Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productPerformanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="sales"
              >
                {productPerformanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Monthly Revenue & Customer Growth
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? `₹${value}` : value,
                name === 'revenue' ? 'Revenue' : 'Customers'
              ]}
            />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
            <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Customer Purchase Patterns
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Average Order Value</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹2,480</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Repeat Customer Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Peak Sales Hour</span>
              <span className="font-semibold text-gray-900 dark:text-white">2:00 PM - 4:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Best Selling Day</span>
              <span className="font-semibold text-gray-900 dark:text-white">Friday</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Revenue Analysis & Forecasting
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Projected Monthly Revenue</span>
              <span className="font-semibold text-green-600">₹5,25,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Growth Rate (YoY)</span>
              <span className="font-semibold text-green-600">+24%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Profit Margin</span>
              <span className="font-semibold text-gray-900 dark:text-white">32%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Return Rate</span>
              <span className="font-semibold text-red-600">2.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
