import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Package, Users, AlertTriangle, Calendar } from 'lucide-react';

const Reports = () => {
  const [dateRange, setDateRange] = useState('7');

  // Sample data
  const salesData = [
    { name: 'Mon', sales: 12000, orders: 8 },
    { name: 'Tue', sales: 19000, orders: 12 },
    { name: 'Wed', sales: 15000, orders: 10 },
    { name: 'Thu', sales: 22000, orders: 15 },
    { name: 'Fri', sales: 28000, orders: 18 },
    { name: 'Sat', sales: 35000, orders: 22 },
    { name: 'Sun', sales: 18000, orders: 11 }
  ];

  const productTypeData = [
    { name: 'Emulsion', value: 45, color: '#1e3a8a' },
    { name: 'Oil Paint', value: 25, color: '#dc2626' },
    { name: 'Exterior', value: 20, color: '#16a34a' },
    { name: 'Primer', value: 10, color: '#f59e0b' }
  ];

  const topProducts = [
    { name: 'Asian Paints Premium White', sales: 85, revenue: 102000 },
    { name: 'Berger Weather Shield', sales: 72, revenue: 129600 },
    { name: 'Dulux Oil Paint Blue', sales: 68, revenue: 102000 },
    { name: 'Nerolac Primer', sales: 45, revenue: 36000 }
  ];

  const lowStockItems = [
    { name: 'Dulux Weather Shield Red', stock: 8, threshold: 20 },
    { name: 'Asian Paints Oil Blue', stock: 12, threshold: 25 },
    { name: 'Berger Primer White', stock: 15, threshold: 30 }
  ];

  const recentCustomers = [
    { name: 'Rajesh Kumar', orders: 3, totalSpent: 15600, lastOrder: '2024-01-15' },
    { name: 'Priya Sharma', orders: 2, totalSpent: 12800, lastOrder: '2024-01-14' },
    { name: 'Amit Patel', orders: 4, totalSpent: 22400, lastOrder: '2024-01-13' }
  ];

  const StatCard = ({ title, value, icon, color, change }: any) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
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
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-650 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="₹1,85,400"
            icon={<DollarSign className="h-6 w-6 text-white" />}
            color="bg-green-500"
            change={12.5}
          />
          <StatCard
            title="Total Orders"
            value="96"
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            color="bg-blue-500"
            change={8.2}
          />
          <StatCard
            title="Products Sold"
            value="284"
            icon={<Package className="h-6 w-6 text-white" />}
            color="bg-purple-500"
            change={15.3}
          />
          <StatCard
            title="Active Customers"
            value="48"
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-orange-500"
            change={6.7}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Daily Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? `₹${value}` : value,
                  name === 'sales' ? 'Sales' : 'Orders'
                ]} />
                <Bar dataKey="sales" fill="#1e3a8a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sales by Product Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {productTypeData.map((item, index) => (
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
            <div className="space-y-4">
              {topProducts.map((product, index) => (
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
              ))}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Customers</h3>
            <div className="space-y-4">
              {recentCustomers.map((customer, index) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{item.name}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600 dark:text-red-400">Current: {item.stock} units</span>
                  <span className="text-gray-600 dark:text-gray-300">Min: {item.threshold} units</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${(item.stock / item.threshold) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
