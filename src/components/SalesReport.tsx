
import React from 'react';
import { TrendingUp, Calendar, DollarSign, Package } from 'lucide-react';

const SalesReport = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="mr-3 h-6 w-6 text-green-600" />
          Sales Reports
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Today's Sales</p>
              <p className="text-2xl font-bold">₹12,450</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">This Month</p>
              <p className="text-2xl font-bold">₹3,85,200</p>
            </div>
            <Calendar className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Items Sold</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <Package className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sales Analytics</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Detailed sales reports and analytics will be displayed here. This includes:
        </p>
        <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li>• Daily, weekly, and monthly sales trends</li>
          <li>• Product-wise sales performance</li>
          <li>• Customer purchase patterns</li>
          <li>• Revenue analysis and forecasting</li>
        </ul>
      </div>
    </div>
  );
};

export default SalesReport;
