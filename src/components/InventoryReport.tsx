
import React from 'react';
import { Package, AlertTriangle, TrendingDown, BarChart3 } from 'lucide-react';

const InventoryReport = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Package className="mr-3 h-6 w-6 text-blue-600" />
          Inventory Reports
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Products</p>
              <p className="text-2xl font-bold">1,245</p>
            </div>
            <Package className="h-8 w-8 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Low Stock Items</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Out of Stock</p>
              <p className="text-2xl font-bold">7</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Inventory Analytics</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive inventory reports and analytics will be displayed here. This includes:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li>• Stock levels and movement tracking</li>
          <li>• Product aging and turnover analysis</li>
          <li>• Reorder point recommendations</li>
          <li>• Supplier performance metrics</li>
          <li>• Dead stock identification</li>
        </ul>
      </div>
    </div>
  );
};

export default InventoryReport;
