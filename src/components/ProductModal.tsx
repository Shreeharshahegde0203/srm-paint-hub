
import React from "react";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProducts: any[];
  products: any[];
  newProductId: string;
  setNewProductId: (id: string) => void;
  newProductRate: number;
  setNewProductRate: (rate: number) => void;
  onAddProductMapping: (e: React.FormEvent) => Promise<void>;
  onDeleteMapping: (productId: string) => Promise<void>;
  productLoading: boolean;
}

const ProductModal = ({
  isOpen,
  onClose,
  customerProducts,
  products,
  newProductId,
  setNewProductId,
  newProductRate,
  setNewProductRate,
  onAddProductMapping,
  onDeleteMapping,
  productLoading
}: ProductModalProps) => {
  if (!isOpen) return null;

  const handleAddProductMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddProductMapping(e);
      setNewProductId("");
      setNewProductRate(0);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteMapping = async (productId: string) => {
    try {
      await onDeleteMapping(productId);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg transition-colors max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Assign Products to Customer</h3>
        {productLoading ? (
          <div className="text-gray-500">Loading…</div>
        ) : (
          <>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr>
                  <th className="text-left px-2">Product</th>
                  <th className="text-left px-2">Rate</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customerProducts.map(cp => (
                  <tr key={cp.product_id}>
                    <td className="px-2">{cp.product?.name || "Deleted Product"}</td>
                    <td className="px-2">₹{cp.rate}</td>
                    <td>
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteMapping(cp.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form className="flex gap-2 items-end" onSubmit={handleAddProductMapping}>
              <select
                value={newProductId}
                onChange={e => setNewProductId(e.target.value)}
                className="border rounded p-2 dark:bg-slate-900 dark:text-white"
                required
              >
                <option value="">Select Product</option>
                {(products || []).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={newProductRate}
                onChange={e => setNewProductRate(Number(e.target.value))}
                placeholder="Rate"
                min="0"
                className="border rounded p-2 w-28 dark:bg-slate-900 dark:text-white"
                required
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Assign
              </button>
              <button 
                type="button" 
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 ml-2"
                onClick={onClose}
              >
                Done
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
