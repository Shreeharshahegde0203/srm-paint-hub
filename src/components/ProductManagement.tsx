
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, FileUp, AlertTriangle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import SupplierSelector from './SupplierSelector';
import { toast } from "@/hooks/use-toast";
import StockLevelIcon from './StockLevelIcon';

export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  type: string;
  color: string;
  price: number;
  stock: number;
  gstRate: number;
  unit: string;
  description?: string;
  cost_price?: number;
  supplier_id?: string;
}

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductManagement = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // For receive stock workflow integration
  const [quantity, setQuantity] = useState(1);
  const [supplierId, setSupplierId] = useState('');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [billFile, setBillFile] = useState<File | null>(null);

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (b.stock || 0) - (a.stock || 0)); // Highest stock first

  const generateProductCode = () => {
    const number = (products.length + 1).toString().padStart(3, '0');
    return `SRM${number}`;
  };

  // Unified Add Product / Receive Stock
  const ProductForm = ({
    product,
    onClose,
  }: {
    product?: Product;
    onClose: () => void;
  }) => {
    const isEdit = !!product;
    const [formData, setFormData] = useState<Partial<Product>>(
      product || {
        code: generateProductCode(),
        name: '',
        brand: '',
        type: '',
        color: '',
        price: 0,
        stock: 0,
        gstRate: 18,
        unit: 'Litre',
        description: '',
      }
    );
    const [localCostPrice, setLocalCostPrice] = useState<number>(product?.cost_price ?? 0);
    const [localQuantity, setLocalQuantity] = useState<number>(isEdit ? 0 : 1);
    const [localSupplierId, setLocalSupplierId] = useState<string>(product?.supplier_id ?? '');
    const [localBillFile, setLocalBillFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        let newProductId = product?.id;
        if (!isEdit) {
          // Insert product first, then inventory receipt
          const { data: inserted, error: insErr } = await supabase
            .from("products")
            .insert({
              code: formData.code,
              name: formData.name,
              brand: formData.brand,
              type: formData.type,
              color: formData.color,
              price: formData.price,
              gst_rate: formData.gstRate ?? 18,
              unit: formData.unit,
              description: formData.description,
              supplier_id: localSupplierId || null,
              cost_price: localCostPrice,
              stock: localQuantity,
            })
            .select("*")
            .single();

          if (insErr) {
            toast({ title: "Error", variant: "destructive", description: insErr.message });
            setLoading(false);
            return;
          }
          newProductId = inserted.id;

          // Insert opening inventory receipt if initial quantity > 0
          if (localQuantity > 0) {
            const { data: receipt, error: recErr } = await supabase
              .from("inventory_receipts")
              .insert({
                product_id: newProductId,
                supplier_id: localSupplierId || null,
                quantity: localQuantity,
                cost_price: localCostPrice,
                receiving_date: new Date().toISOString().substring(0, 10),
              })
              .select("*")
              .single();
            if (recErr) throw recErr;

            // Stock movement log
            await supabase.from("inventory_movements").insert({
              product_id: newProductId,
              movement_type: "in",
              quantity: localQuantity,
              reason: "Opening stock",
              related_receipt_id: receipt.id,
            });

            // Bill upload (if any)
            if (localBillFile) {
              const filename = `${receipt.id}_${localBillFile.name}`;
              const { data: uploadData, error: uploadErr } = await supabase.storage
                .from("bill-uploads")
                .upload(filename, localBillFile);
              if (uploadErr) throw uploadErr;
              await supabase.from("bill_attachments").insert({
                receipt_id: receipt.id,
                file_url: uploadData.path,
              });
            }
          }
        } else {
          // Update product
          await supabase
            .from("products")
            .update({
              code: formData.code,
              name: formData.name,
              brand: formData.brand,
              type: formData.type,
              color: formData.color,
              price: formData.price,
              gst_rate: formData.gstRate ?? 18,
              unit: formData.unit,
              description: formData.description,
              supplier_id: localSupplierId || null,
              cost_price: localCostPrice,
            })
            .eq("id", product.id);

          toast({ title: "Product updated!" });
        }
        setLoading(false);
        onClose();
        toast({ title: isEdit ? "Product Updated" : "Product Added" });
      } catch (err: any) {
        setLoading(false);
        toast({ title: "Error", variant: "destructive", description: err.message });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto transition-colors">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Product Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                required
                readOnly={isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {/* Only for Add (not Edit) */}
              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Initial Quantity</label>
                  <input
                    type="number"
                    value={localQuantity}
                    onChange={e => setLocalQuantity(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                    min="0"
                    required
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Only for Add (not Edit) */}
              {!isEdit && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Cost Price (Confidential)</label>
                    <input
                      type="number"
                      value={localCostPrice}
                      onChange={e => setLocalCostPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Supplier</label>
                    <SupplierSelector value={localSupplierId} onChange={setLocalSupplierId} />
                  </div>
                </>
              )}
            </div>
            {/* Only for Add (not Edit) */}
            {!isEdit && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Upload Bill (optional)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={e => setLocalBillFile(e.target.files?.[0] || null)}
                  className="w-full border rounded p-2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
                rows={2}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                {isEdit ? 'Update' : 'Add'} Product
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-100 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Database</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add / Receive Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
        />
      </div>

      {/* Products List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredProducts.map((product) => (
          <div key={product.id} className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 ${product.stock === 0 ? 'bg-gray-100 dark:bg-slate-950 opacity-60' : 'bg-white dark:bg-slate-900'} border-gray-200 dark:border-gray-700 transition-colors`}>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium text-blue-600">{product.code}</span>
                <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{product.brand}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">₹{product.price}</span>
                {/* Stock status badge */}
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold
                  ${product.stock === 0
                    ? 'bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200'
                    : product.stock < 20
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }
                `}>
                  {product.stock === 0 ? "Out of Stock" : product.stock < 20 ? "Low Stock" : "In Stock"}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Stock: {product.stock}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setShowForm(true);
                }}
                className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 p-1 rounded"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-1 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No products found. Add your first product to get started.
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;

