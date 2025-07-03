
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface BalanceSheetData {
  assets: {
    cash: number;
    inventory: number;
    accountsReceivable: number;
    equipment: number;
  };
  liabilities: {
    accountsPayable: number;
    loans: number;
    accruals: number;
  };
  equity: {
    paidInCapital: number;
    retainedEarnings: number;
  };
}

const EnhancedBalanceSheetReport = () => {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData>({
    assets: { cash: 50000, inventory: 0, accountsReceivable: 0, equipment: 25000 },
    liabilities: { accountsPayable: 0, loans: 15000, accruals: 2000 },
    equity: { paidInCapital: 50000, retainedEarnings: 0 }
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<BalanceSheetData>(balanceSheet);
  const [realTimeData, setRealTimeData] = useState({ totalSales: 0, totalInventoryValue: 0 });

  useEffect(() => {
    fetchRealTimeData();
  }, []);

  const fetchRealTimeData = async () => {
    try {
      // Fetch total sales
      const { data: invoices } = await supabase
        .from('invoices')
        .select('total')
        .eq('status', 'paid');
      
      const totalSales = invoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;

      // Fetch inventory value
      const { data: products } = await supabase
        .from('products')
        .select('stock, price');
      
      const totalInventoryValue = products?.reduce((sum, prod) => sum + (prod.stock * Number(prod.price)), 0) || 0;

      setRealTimeData({ totalSales, totalInventoryValue });
      
      // Update balance sheet with real-time data
      setBalanceSheet(prev => ({
        ...prev,
        assets: {
          ...prev.assets,
          inventory: totalInventoryValue
        },
        equity: {
          ...prev.equity,
          retainedEarnings: totalSales * 0.2 // Assuming 20% profit margin
        }
      }));
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const handleSave = () => {
    setBalanceSheet(editedData);
    setEditMode(false);
    toast({
      title: "Success",
      description: "Balance sheet updated successfully",
    });
  };

  const handleCancel = () => {
    setEditedData(balanceSheet);
    setEditMode(false);
  };

  const updateValue = (category: keyof BalanceSheetData, field: string, value: number) => {
    setEditedData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const totalAssets = Object.values(balanceSheet.assets).reduce((sum, val) => sum + val, 0);
  const totalLiabilities = Object.values(balanceSheet.liabilities).reduce((sum, val) => sum + val, 0);
  const totalEquity = Object.values(balanceSheet.equity).reduce((sum, val) => sum + val, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            Balance Sheet
            {isBalanced ? (
              <TrendingUp className="ml-2 h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="ml-2 h-5 w-5 text-red-600" />
            )}
          </CardTitle>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assets */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">Assets</h3>
              <div className="space-y-3">
                {Object.entries(balanceSheet.assets).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    {editMode ? (
                      <Input
                        type="number"
                        value={editedData.assets[key as keyof typeof editedData.assets]}
                        onChange={(e) => updateValue('assets', key, parseFloat(e.target.value) || 0)}
                        className="w-32"
                        disabled={key === 'inventory'} // Inventory is auto-calculated
                      />
                    ) : (
                      <span className="font-medium">₹{value.toLocaleString()}</span>
                    )}
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Assets</span>
                    <span>₹{totalAssets.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-600">Liabilities</h3>
              <div className="space-y-3">
                {Object.entries(balanceSheet.liabilities).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    {editMode ? (
                      <Input
                        type="number"
                        value={editedData.liabilities[key as keyof typeof editedData.liabilities]}
                        onChange={(e) => updateValue('liabilities', key, parseFloat(e.target.value) || 0)}
                        className="w-32"
                      />
                    ) : (
                      <span className="font-medium">₹{value.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-green-600 mt-6">Equity</h3>
              <div className="space-y-3">
                {Object.entries(balanceSheet.equity).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    {editMode ? (
                      <Input
                        type="number"
                        value={editedData.equity[key as keyof typeof editedData.equity]}
                        onChange={(e) => updateValue('equity', key, parseFloat(e.target.value) || 0)}
                        className="w-32"
                        disabled={key === 'retainedEarnings'} // Auto-calculated from sales
                      />
                    ) : (
                      <span className="font-medium">₹{value.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Liabilities & Equity</span>
                  <span>₹{totalLiabilitiesAndEquity.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Check */}
          <div className={`mt-6 p-4 rounded-lg ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Balance Check:</span>
              <span className={`font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {isBalanced ? 'Balanced ✓' : `Difference: ₹${Math.abs(totalAssets - totalLiabilitiesAndEquity).toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Real-time Data Summary */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold mb-2">Real-time Business Data</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Total Sales (Paid):</span>
                <div className="font-bold text-green-600">₹{realTimeData.totalSales.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Inventory Value:</span>
                <div className="font-bold text-blue-600">₹{realTimeData.totalInventoryValue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBalanceSheetReport;
