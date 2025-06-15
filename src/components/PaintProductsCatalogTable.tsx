
import React, { useState } from "react";
import { usePaintProductsCatalog } from "@/hooks/usePaintProductsCatalog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Search, Plus } from "lucide-react";
import AddPaintProductForm from "./AddPaintProductForm";

const PaintProductsCatalogTable = () => {
  const { catalog, isLoading, updateProduct } = usePaintProductsCatalog();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const filteredCatalog = catalog?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading paint products catalog...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paint Products Catalog</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search by name, code, or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
        />
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddPaintProductForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-slate-700">
              <TableHead className="font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Product Name</TableHead>
              <TableHead className="font-semibold">Brand</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Color</TableHead>
              <TableHead className="font-semibold">Default Price</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCatalog?.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                <TableCell className="font-mono text-sm">{product.code}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>
                  {product.color && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {product.color}
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-green-600">₹{product.default_price}</TableCell>
                <TableCell>
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCatalog?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No products found matching your search." : "No products in catalog yet."}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredCatalog?.length || 0} of {catalog?.length || 0} products
      </div>
    </div>
  );
};

export default PaintProductsCatalogTable;
