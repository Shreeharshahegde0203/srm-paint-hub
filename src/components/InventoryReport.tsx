
import React from 'react';
import { Package, AlertTriangle, TrendingDown, Truck, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const InventoryReport = () => {
  // Sample data for charts
  const stockLevelsData = [
    { category: 'Emulsion', inStock: 450, lowStock: 25, outOfStock: 3 },
    { category: 'Enamel', inStock: 280, lowStock: 18, outOfStock: 2 },
    { category: 'Primer', inStock: 150, lowStock: 12, outOfStock: 1 },
    { category: 'Putty', inStock: 320, lowStock: 15, outOfStock: 0 },
    { category: 'Thinner', inStock: 200, lowStock: 8, outOfStock: 1 },
  ];

  const productAgingData = [
    { period: '0-30 days', products: 180, value: 450000 },
    { period: '31-60 days', products: 120, value: 280000 },
    { period: '61-90 days', products: 80, value: 180000 },
    { period: '91-180 days', products: 45, value: 95000 },
    { period: '180+ days', products: 25, value: 35000 },
  ];

  const turnoverData = [
    { product: 'Asian Paints Emulsion', turnover: 8.5, reorderPoint: 50 },
    { product: 'Berger Enamel', turnover: 6.2, reorderPoint: 30 },
    { product: 'Dulux Primer', turnover: 4.8, reorderPoint: 25 },
    { product: 'Nerolac Putty', turnover: 7.1, reorderPoint: 40 },
    { product: 'Paint Thinner', turnover: 5.9, reorderPoint: 35 },
  ];

  const supplierPerformanceData = [
    { name: 'Asian Paints', onTime: 95, quality: 98, cost: 85 },
    { name: 'Berger Paints', onTime: 88, quality: 94, cost: 90 },
    { name: 'Dulux', onTime: 92, quality: 96, cost: 82 },
    { name: 'Nerolac', onTime: 85, quality: 91, cost: 88 },
    { name: 'Local Suppliers', onTime: 78, quality: 85, cost: 95 },
  ];

  const deadStockData = [
    { product: 'Old Color Variants', value: 45000, age: 240 },
    { product: 'Discontinued Items', value: 32000, age: 180 },
    { product: 'Seasonal Products', value: 28000, age: 150 },
    { product: 'Damaged Goods', value: 15000, age: 90 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Package className="mr-3 h-6 w-6 text-blue-600" />
          Inventory Analytics & Reports
        </h2>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Products</p>
              <p className="text-2xl font-bold">1,430</p>
              <p className="text-sm text-blue-200">+45 this month</p>
            </div>
            <Package className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Low Stock Items</p>
              <p className="text-2xl font-bold">78</p>
              <p className="text-sm text-yellow-200">Needs attention</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Out of Stock</p>
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-red-200">Immediate reorder</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Inventory Value</p>
              <p className="text-2xl font-bold">₹12.4L</p>
              <p className="text-sm text-green-200">+8% this quarter</p>
            </div>
            <Truck className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Stock Levels by Category */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Stock Levels by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevelsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="inStock" stackId="a" fill="#10B981" name="In Stock" />
              <Bar dataKey="lowStock" stackId="a" fill="#F59E0B" name="Low Stock" />
              <Bar dataKey="outOfStock" stackId="a" fill="#EF4444" name="Out of Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Aging Analysis */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Product Aging Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productAgingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ period, products }) => `${period} (${products})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="products"
              >
                {productAgingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} products`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Turnover Analysis */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Product Turnover & Reorder Points
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={turnoverData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="product" type="category" width={150} />
            <Tooltip formatter={(value, name) => [value, name === 'turnover' ? 'Turnover Rate' : 'Reorder Point']} />
            <Bar dataKey="turnover" fill="#3B82F6" name="Turnover Rate" />
            <Bar dataKey="reorderPoint" fill="#10B981" name="Reorder Point" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Supplier Performance Metrics
          </h3>
          <div className="space-y-4">
            {supplierPerformanceData.map((supplier, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">{supplier.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">On-time:</span>
                    <span className="font-semibold">{supplier.onTime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Quality:</span>
                    <span className="font-semibold">{supplier.quality}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Cost:</span>
                    <span className="font-semibold">{supplier.cost}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Dead Stock Identification
          </h3>
          <div className="space-y-3">
            {deadStockData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{item.product}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{item.age} days old</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-red-600">₹{(item.value / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-gray-500">tied up</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-red-800 dark:text-red-200">Total Dead Stock Value:</span>
              <span className="font-bold text-red-800 dark:text-red-200">₹1.20L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
          Inventory Optimization Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-700 dark:text-blue-300">Immediate Actions:</h4>
            <ul className="text-sm text-blue-600 dark:text-blue-200 space-y-1">
              <li>• Reorder 7 out-of-stock products immediately</li>
              <li>• Review pricing for 25 slow-moving items</li>
              <li>• Liquidate ₹45K worth of old color variants</li>
              <li>• Increase safety stock for high-turnover items</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-700 dark:text-blue-300">Strategic Improvements:</h4>
            <ul className="text-sm text-blue-600 dark:text-blue-200 space-y-1">
              <li>• Implement just-in-time ordering for seasonal items</li>
              <li>• Negotiate better terms with top-performing suppliers</li>
              <li>• Set up automated reorder alerts</li>
              <li>• Consider bulk discounts for fast-moving products</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
