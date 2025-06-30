
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Product } from '../data/products';
import StockLevelIcon from '../components/StockLevelIcon';
import ViewModeToggle from '../components/ViewModeToggle';
import { useSupabaseAuth } from "../contexts/SupabaseAuthContext";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";
import { useNavigate } from "react-router-dom";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import ProductManagement from "../components/ProductManagement";

const Inventory = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const {
    products: rawProducts,
    isLoading: isProductsLoading,
    addProduct,
    updateProduct,
    deleteProduct
  } = useSupabaseProducts();

  // Add mapping logic here to conform to local Product type
  const products: Product[] = (rawProducts || []).map((product: any) => ({
    ...product,
    gstRate: product.gst_rate, // map Supabase's gst_rate to gstRate
    unit_quantity: parseFloat(product.unit?.split(' ')[0]) || 1,
    unit_type: product.unit?.split(' ').slice(1).join(' ') || 'Piece',
  }));

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    const payload: any = {
      code: productData.code,
      name: productData.name,
      brand: productData.brand,
      type: productData.type,
      color: productData.color,
      stock: productData.stock,
      price: productData.price,
      gst_rate: productData.gstRate ?? 18,
      unit: productData.unit || "1 Piece",
      description: productData.description,
      image: productData.image,
    };

    await addProduct(payload as TablesInsert<"products">);
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    const payload: any = {
      name: productData.name,
      brand: productData.brand,
      type: productData.type,
      color: productData.color,
      price: productData.price,
      gst_rate: productData.gstRate,
      unit: productData.unit,
      description: productData.description,
      image: productData.image,
    };

    await updateProduct({ id, product: payload as TablesUpdate<"products"> });
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Package className="mr-3 h-8 w-8 text-blue-600" />
                Shreeram Marketing - Paint Inventory
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Complete inventory management for paint and paint-related products</p>
            </div>
          </div>
        </div>

        {/* Product Management Component */}
        <ProductManagement
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>
    </div>
  );
};

export default Inventory;
