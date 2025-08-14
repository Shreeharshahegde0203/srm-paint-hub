import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingCart, Package, AlertTriangle, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface DashboardData {
  totalProducts: number;
  totalInvoices: number;
  totalSales: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalCustomers: number;
  pendingInvoices: number;
  thisMonthSales: number;
  lastMonthSales: number;
  totalInventoryValue: number;
}

export const DashboardMetrics = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    totalInvoices: 0,
    totalSales: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalCustomers: 0,
    pendingInvoices: 0,
    thisMonthSales: 0,
    lastMonthSales: 0,
    totalInventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        productsResult,
        invoicesResult,
        customersResult,
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('invoices').select('*'),
        supabase.from('customers').select('id'),
      ]);

      const products = productsResult.data || [];
      const invoices = invoicesResult.data || [];
      const customers = customersResult.data || [];

      // Calculate metrics
      const totalProducts = products.length;
      const totalInvoices = invoices.length;
      const totalSales = invoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0);
      const lowStockItems = products.filter(p => p.stock < 10 && p.stock > 0).length;
      const outOfStockItems = products.filter(p => p.stock === 0).length;
      const totalCustomers = customers.length;
      const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
      const totalInventoryValue = products.reduce((sum: number, p: any) => sum + (Number(p.stock || 0) * Number(p.price || 0)), 0);

      // Calculate monthly sales
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const thisMonthSales = invoices
        .filter(inv => {
          const invDate = new Date(inv.created_at);
          return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        })
        .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

      const lastMonthSales = invoices
        .filter(inv => {
          const invDate = new Date(inv.created_at);
          return invDate.getMonth() === lastMonth && invDate.getFullYear() === lastMonthYear;
        })
        .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

      setDashboardData({
        totalProducts,
        totalInvoices,
        totalSales,
        lowStockItems,
        outOfStockItems,
        totalCustomers,
        pendingInvoices,
        thisMonthSales,
        lastMonthSales,
        totalInventoryValue,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoice_items'
        },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_receipts'
        },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_movements'
        },
        () => {
          fetchDashboardData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const monthlyGrowth = dashboardData.lastMonthSales > 0 
    ? ((dashboardData.thisMonthSales - dashboardData.lastMonthSales) / dashboardData.lastMonthSales) * 100 
    : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Sales</p>
              <p className="text-2xl font-bold">₹{dashboardData.totalSales.toLocaleString()}</p>
              <p className="text-sm text-blue-200">All time revenue</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Invoices</p>
              <p className="text-2xl font-bold">{dashboardData.totalInvoices}</p>
              <p className="text-sm text-green-200">{dashboardData.pendingInvoices} pending</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Products</p>
              <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
              <p className="text-sm text-purple-200">Live inventory</p>
            </div>
            <Package className="h-8 w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Inventory Value</p>
              <p className="text-2xl font-bold">₹{dashboardData.totalInventoryValue.toLocaleString()}</p>
              <p className="text-sm text-amber-200">Stock value @ unit price</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Stock Alerts</p>
              <p className="text-2xl font-bold">{dashboardData.lowStockItems + dashboardData.outOfStockItems}</p>
              <p className="text-sm text-orange-200">{dashboardData.outOfStockItems} out of stock</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100">Total Customers</p>
              <p className="text-2xl font-bold">{dashboardData.totalCustomers}</p>
              <p className="text-sm text-teal-200">Active customer base</p>
            </div>
            <Users className="h-8 w-8 text-teal-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Monthly Growth</p>
              <p className="text-2xl font-bold">{monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%</p>
              <p className="text-sm text-pink-200">vs last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-pink-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};