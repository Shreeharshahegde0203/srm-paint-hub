
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import SalesReport from '../components/SalesReport';
import InventoryReport from '../components/InventoryReport';
import EnhancedBalanceSheetReport from '../components/EnhancedBalanceSheetReport';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');

  const tabs = [
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory Analytics', icon: Package },
    { id: 'balance', label: 'Balance Sheet', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
                Business Reports & Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Comprehensive business intelligence and financial reporting
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          {activeTab === 'sales' && <SalesReport />}
          {activeTab === 'inventory' && <InventoryReport />}
          {activeTab === 'balance' && <EnhancedBalanceSheetReport />}
        </div>
      </div>
    </div>
  );
};

export default Reports;
