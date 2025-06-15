
import React, { useState } from "react";
import { usePaintProductsCatalog } from "@/hooks/usePaintProductsCatalog";
import AddPaintProductForm from "@/components/AddPaintProductForm";
import { Plus } from "lucide-react";

export default function ProductCatalogPage() {
  const { catalog, isLoading } = usePaintProductsCatalog();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paint Product Master Catalog
        </h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5" /> Add New Product
        </button>
      </div>

      {showForm && (
        <AddPaintProductForm onClose={() => setShowForm(false)} />
      )}

      <div className="mt-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : catalog && catalog.length > 0 ? (
          <table className="min-w-full table-auto border-collapse bg-white dark:bg-slate-900 rounded shadow">
            <thead>
              <tr className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200">
                <th className="px-4 py-2">Code</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Default Price</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map(prod => (
                <tr key={prod.id} className="hover:bg-green-50 dark:hover:bg-slate-800 border-b">
                  <td className="px-4 py-2 font-bold text-blue-600">{prod.code}</td>
                  <td className="px-4 py-2">{prod.name}</td>
                  <td className="px-4 py-2">{prod.brand}</td>
                  <td className="px-4 py-2">{prod.type}</td>
                  <td className="px-4 py-2">₹{prod.default_price}</td>
                  <td className="px-4 py-2">{prod.color || "-"}</td>
                  <td className="px-4 py-2">{prod.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 mt-12 text-center">
            No products in catalog yet.
          </div>
        )}
      </div>
    </div>
  );
}
