import React, { useState } from 'react';
import { BarChart3, Package, TrendingUp, FileText } from 'lucide-react';
import SalesReport from '../components/SalesReport';
import InventoryReport from '../components/InventoryReport';
import BalanceSheetReport from '../components/BalanceSheetReport';

const Reports = () => {
  const [activeReport, setActiveReport] = useState<string>('sales');

  const renderSalesReport = () => {
    return <SalesReport />;
  };

  const renderInventoryReport = () => {
    return <InventoryReport />;
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case 'sales':
        return renderSalesReport();
      case 'inventory':
        return renderInventoryReport();
      case 'balance_sheet':
        return <BalanceSheetReport />;
      default:
        return renderSalesReport();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
            Business Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Comprehensive reporting for sales, inventory, and financial analysis
          </p>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveReport('sales')}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
                activeReport === 'sales'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Sales Reports
            </button>
            <button
              onClick={() => setActiveReport('inventory')}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
                activeReport === 'inventory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Package className="mr-2 h-5 w-5" />
              Inventory Reports
            </button>
            <button
              onClick={() => setActiveReport('balance_sheet')}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
                activeReport === 'balance_sheet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FileText className="mr-2 h-5 w-5" />
              Balance Sheet
            </button>
          </div>
        </div>

        {/* Report Content */}
        {renderReportContent()}
      </div>
    </div>
  );
};

export default Reports;
