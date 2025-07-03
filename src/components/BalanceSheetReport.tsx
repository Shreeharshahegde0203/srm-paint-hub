
import React, { useState, useEffect } from 'react';
import { FileText, Download, Calculator, TrendingUp } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BalanceSheetData {
  assets: {
    currentAssets: {
      inventory: number;
      accountsReceivable: number;
      cash: number;
    };
    fixedAssets: {
      equipment: number;
      furniture: number;
    };
  };
  liabilities: {
    currentLiabilities: {
      accountsPayable: number;
      shortTermLoans: number;
    };
    longTermLiabilities: {
      longTermLoans: number;
    };
  };
  equity: {
    capital: number;
    retainedEarnings: number;
  };
}

const BalanceSheetReport = () => {
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'balance_sheet' | 'tally'>('balance_sheet');

  const generateBalanceSheet = async () => {
    setLoading(true);
    try {
      // Fetch inventory value
      const { data: products } = await supabase
        .from('products')
        .select('stock, price, cost_price');

      const inventoryValue = (products || []).reduce((sum, product) => {
        const costPrice = product.cost_price || product.price;
        return sum + (product.stock * costPrice);
      }, 0);

      // Fetch accounts receivable (pending invoices)
      const { data: pendingInvoices } = await supabase
        .from('invoices')
        .select('total')
        .eq('status', 'pending');

      const accountsReceivable = (pendingInvoices || []).reduce((sum, invoice) => sum + invoice.total, 0);

      // Fetch paid invoices for cash calculation
      const { data: paidInvoices } = await supabase
        .from('invoices')
        .select('total')
        .eq('status', 'paid');

      const cash = (paidInvoices || []).reduce((sum, invoice) => sum + invoice.total, 0);

      // Calculate accounts payable (unpaid inventory receipts)
      const { data: unpaidReceipts } = await supabase
        .from('inventory_receipts')
        .select('cost_price, quantity')
        .eq('bill_paid', false);

      const accountsPayable = (unpaidReceipts || []).reduce((sum, receipt) => 
        sum + (receipt.cost_price * receipt.quantity), 0);

      // Sample data for other items (in real scenario, these would come from additional tables)
      const balanceSheet: BalanceSheetData = {
        assets: {
          currentAssets: {
            inventory: inventoryValue,
            accountsReceivable,
            cash: cash * 0.1, // Assuming 10% is actual cash on hand
          },
          fixedAssets: {
            equipment: 50000, // Sample values
            furniture: 25000,
          },
        },
        liabilities: {
          currentLiabilities: {
            accountsPayable,
            shortTermLoans: 0,
          },
          longTermLiabilities: {
            longTermLoans: 0,
          },
        },
        equity: {
          capital: 100000, // Sample initial capital
          retainedEarnings: cash * 0.9 - accountsPayable, // Simplified calculation
        },
      };

      setBalanceSheetData(balanceSheet);
      toast({
        title: "Success",
        description: "Balance sheet generated successfully!",
      });
    } catch (error) {
      console.error('Error generating balance sheet:', error);
      toast({
        title: "Error",
        description: "Failed to generate balance sheet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!balanceSheetData) return;

    const csvData = [
      ['BALANCE SHEET'],
      [''],
      ['ASSETS'],
      ['Current Assets'],
      ['Inventory', balanceSheetData.assets.currentAssets.inventory.toFixed(2)],
      ['Accounts Receivable', balanceSheetData.assets.currentAssets.accountsReceivable.toFixed(2)],
      ['Cash', balanceSheetData.assets.currentAssets.cash.toFixed(2)],
      ['Total Current Assets', (
        balanceSheetData.assets.currentAssets.inventory +
        balanceSheetData.assets.currentAssets.accountsReceivable +
        balanceSheetData.assets.currentAssets.cash
      ).toFixed(2)],
      [''],
      ['Fixed Assets'],
      ['Equipment', balanceSheetData.assets.fixedAssets.equipment.toFixed(2)],
      ['Furniture', balanceSheetData.assets.fixedAssets.furniture.toFixed(2)],
      ['Total Fixed Assets', (
        balanceSheetData.assets.fixedAssets.equipment +
        balanceSheetData.assets.fixedAssets.furniture
      ).toFixed(2)],
      [''],
      ['TOTAL ASSETS', (
        balanceSheetData.assets.currentAssets.inventory +
        balanceSheetData.assets.currentAssets.accountsReceivable +
        balanceSheetData.assets.currentAssets.cash +
        balanceSheetData.assets.fixedAssets.equipment +
        balanceSheetData.assets.fixedAssets.furniture
      ).toFixed(2)],
      [''],
      ['LIABILITIES & EQUITY'],
      ['Current Liabilities'],
      ['Accounts Payable', balanceSheetData.liabilities.currentLiabilities.accountsPayable.toFixed(2)],
      ['Short Term Loans', balanceSheetData.liabilities.currentLiabilities.shortTermLoans.toFixed(2)],
      [''],
      ['Equity'],
      ['Capital', balanceSheetData.equity.capital.toFixed(2)],
      ['Retained Earnings', balanceSheetData.equity.retainedEarnings.toFixed(2)],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balance_sheet_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateTallyFormat = () => {
    if (!balanceSheetData) return;

    const tallyData = `
TALLY EXPORT FORMAT
==================

Ledger: Inventory
Amount: ${balanceSheetData.assets.currentAssets.inventory.toFixed(2)}

Ledger: Accounts Receivable  
Amount: ${balanceSheetData.assets.currentAssets.accountsReceivable.toFixed(2)}

Ledger: Cash
Amount: ${balanceSheetData.assets.currentAssets.cash.toFixed(2)}

Ledger: Accounts Payable
Amount: -${balanceSheetData.liabilities.currentLiabilities.accountsPayable.toFixed(2)}

Ledger: Capital
Amount: -${balanceSheetData.equity.capital.toFixed(2)}

Ledger: Retained Earnings
Amount: -${balanceSheetData.equity.retainedEarnings.toFixed(2)}
    `;

    const blob = new Blob([tallyData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tally_export_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Tally format exported successfully!",
    });
  };

  const totalAssets = balanceSheetData ? 
    balanceSheetData.assets.currentAssets.inventory +
    balanceSheetData.assets.currentAssets.accountsReceivable +
    balanceSheetData.assets.currentAssets.cash +
    balanceSheetData.assets.fixedAssets.equipment +
    balanceSheetData.assets.fixedAssets.furniture : 0;

  const totalLiabilitiesAndEquity = balanceSheetData ?
    balanceSheetData.liabilities.currentLiabilities.accountsPayable +
    balanceSheetData.liabilities.currentLiabilities.shortTermLoans +
    balanceSheetData.liabilities.longTermLiabilities.longTermLoans +
    balanceSheetData.equity.capital +
    balanceSheetData.equity.retainedEarnings : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="mr-3 h-6 w-6 text-green-600" />
            Balance Sheet & Tally Export
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setReportType('balance_sheet')}
              className={`px-4 py-2 rounded-lg ${
                reportType === 'balance_sheet' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Balance Sheet
            </button>
            <button
              onClick={() => setReportType('tally')}
              className={`px-4 py-2 rounded-lg ${
                reportType === 'tally' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Tally Export
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={generateBalanceSheet}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                Generate Report
              </>
            )}
          </button>

          {balanceSheetData && reportType === 'balance_sheet' && (
            <button
              onClick={exportToCSV}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Download className="mr-2 h-5 w-5" />
              Export CSV
            </button>
          )}

          {balanceSheetData && reportType === 'tally' && (
            <button
              onClick={generateTallyFormat}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center"
            >
              <FileText className="mr-2 h-5 w-5" />
              Export Tally Format
            </button>
          )}
        </div>

        {balanceSheetData && reportType === 'balance_sheet' && (
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-center">BALANCE SHEET</h3>
            <h4 className="text-lg font-semibold mb-2 text-center">As on {new Date().toLocaleDateString('en-IN')}</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Assets */}
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-300 pb-2">ASSETS</h4>
                
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Current Assets</h5>
                  <div className="pl-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Inventory</span>
                      <span>₹{balanceSheetData.assets.currentAssets.inventory.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accounts Receivable</span>
                      <span>₹{balanceSheetData.assets.currentAssets.accountsReceivable.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash</span>
                      <span>₹{balanceSheetData.assets.currentAssets.cash.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total Current Assets</span>
                      <span>₹{(
                        balanceSheetData.assets.currentAssets.inventory +
                        balanceSheetData.assets.currentAssets.accountsReceivable +
                        balanceSheetData.assets.currentAssets.cash
                      ).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Fixed Assets</h5>
                  <div className="pl-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Equipment</span>
                      <span>₹{balanceSheetData.assets.fixedAssets.equipment.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Furniture</span>
                      <span>₹{balanceSheetData.assets.fixedAssets.furniture.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total Fixed Assets</span>
                      <span>₹{(
                        balanceSheetData.assets.fixedAssets.equipment +
                        balanceSheetData.assets.fixedAssets.furniture
                      ).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-400 pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>TOTAL ASSETS</span>
                    <span>₹{totalAssets.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Liabilities & Equity */}
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b-2 border-gray-300 pb-2">LIABILITIES & EQUITY</h4>
                
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Current Liabilities</h5>
                  <div className="pl-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Accounts Payable</span>
                      <span>₹{balanceSheetData.liabilities.currentLiabilities.accountsPayable.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Short Term Loans</span>
                      <span>₹{balanceSheetData.liabilities.currentLiabilities.shortTermLoans.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Long Term Liabilities</h5>
                  <div className="pl-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Long Term Loans</span>
                      <span>₹{balanceSheetData.liabilities.longTermLiabilities.longTermLoans.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Equity</h5>
                  <div className="pl-4 space-y-1">
                    <div className="flex justify-between">
                      <span>Capital</span>
                      <span>₹{balanceSheetData.equity.capital.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retained Earnings</span>
                      <span>₹{balanceSheetData.equity.retainedEarnings.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-400 pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>TOTAL LIABILITIES & EQUITY</span>
                    <span>₹{totalLiabilitiesAndEquity.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Check */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Balance Check:</span>
                <span className={`font-bold ${
                  Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01 
                    ? '✓ Balanced' 
                    : `⚠ Difference: ₹${Math.abs(totalAssets - totalLiabilitiesAndEquity).toFixed(2)}`
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        {balanceSheetData && reportType === 'tally' && (
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Tally Export Preview</h3>
            <div className="bg-white dark:bg-gray-800 p-4 rounded border font-mono text-sm overflow-x-auto">
              <pre>
{`TALLY EXPORT FORMAT
==================

Ledger: Inventory
Amount: ${balanceSheetData.assets.currentAssets.inventory.toFixed(2)}

Ledger: Accounts Receivable  
Amount: ${balanceSheetData.assets.currentAssets.accountsReceivable.toFixed(2)}

Ledger: Cash
Amount: ${balanceSheetData.assets.currentAssets.cash.toFixed(2)}

Ledger: Accounts Payable
Amount: -${balanceSheetData.liabilities.currentLiabilities.accountsPayable.toFixed(2)}

Ledger: Capital
Amount: -${balanceSheetData.equity.capital.toFixed(2)}

Ledger: Retained Earnings
Amount: -${balanceSheetData.equity.retainedEarnings.toFixed(2)}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceSheetReport;
