
import React, { useState } from "react";
import { useRegularCustomers } from "@/hooks/useRegularCustomers";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import CustomerDetailModal from "./CustomerDetailModal";

const RegularCustomersSection = () => {
  const {
    customers,
    customersLoading,
    addCustomer,
    updateCustomer,
    getCustomerProducts,
    addProductMapping,
    deleteProductMapping,
  } = useRegularCustomers();
  const { products } = useSupabaseProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Add or edit customer form
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "", customer_type: "Regular" });
  const [addMode, setAddMode] = useState(true);

  // Modal for attaching products to customer
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>(null);
  const [customerProducts, setCustomerProducts] = useState<any[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [newProductId, setNewProductId] = useState<string>("");
  const [newProductRate, setNewProductRate] = useState<number>(0);

  async function handleAddOrEditCustomer(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (addMode) {
        await addCustomer({
          name: form.name,
          phone: form.phone,
          address: form.address,
          notes: form.notes,
          customer_type: form.customer_type,
        });
        toast({ title: "Regular Customer Added" });
      } else if (editingCustomer) {
        await updateCustomer({ id: editingCustomer.id, customer: form });
        toast({ title: "Regular Customer Updated" });
      }
      setShowForm(false);
      setEditingCustomer(null);
      setForm({ name: "", phone: "", address: "", notes: "", customer_type: "Regular" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  async function openProductModal(customerId: string) {
    setCurrentCustomerId(customerId);
    setProductLoading(true);
    try {
      const list = await getCustomerProducts(customerId);
      setCustomerProducts(list || []);
      setShowProductModal(true);
    } finally {
      setProductLoading(false);
    }
  }

  async function handleAddProductMapping(e: React.FormEvent) {
    e.preventDefault();
    if (!currentCustomerId) return;
    try {
      await addProductMapping({ customerId: currentCustomerId, productId: newProductId, rate: newProductRate });
      toast({ title: "Product added/updated" });
      // refetch
      const list = await getCustomerProducts(currentCustomerId);
      setCustomerProducts(list || []);
      setNewProductId("");
      setNewProductRate(0);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  async function handleDeleteMapping(productId: string) {
    if (!currentCustomerId) return;
    try {
      await deleteProductMapping({ customerId: currentCustomerId, productId });
      toast({ title: "Removed Product from Customer" });
      setCustomerProducts(customerProducts.filter(cp => cp.product_id !== productId));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Regular Customers
        </h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
          onClick={() => {
            setAddMode(true);
            setForm({ name: "", phone: "", address: "", notes: "", customer_type: "Regular" });
            setEditingCustomer(null);
            setShowForm(true);
          }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Regular Customer
        </button>
      </div>

      {/* Add/Edit Customer Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md transition-colors">
            <form onSubmit={handleAddOrEditCustomer} className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Customer Name"
                required
                className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Phone"
                className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Address"
                className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:text-white"
              />
              <select
                value={form.customer_type}
                onChange={e => setForm(f => ({ ...f, customer_type: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:text-white"
              >
                <option value="Regular">Regular</option>
                <option value="Dealer">Dealer</option>
                <option value="New">New</option>
                <option value="Contractor">Contractor</option>
              </select>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Notes"
                className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:text-white"
                rows={2}
              />
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  {addMode ? "Add Customer" : "Update Customer"}
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-100 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => setShowForm(false)}
                >Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customers List */}
      {customersLoading ? (
        <div className="text-gray-500">Loading…</div>
      ) : (
        <div className="space-y-2">
          {customers.map((c) => (
            <div key={c.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{c.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {c.phone} | {c.address}
                </div>
                <div className="text-xs text-gray-400">
                  Type: {c.customer_type} | {c.notes}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button 
                  className="text-blue-600 hover:text-blue-800" 
                  onClick={() => setSelectedCustomer(c)}
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-800" onClick={() => {
                  setEditingCustomer(c);
                  setAddMode(false);
                  setForm({
                    name: c.name || "",
                    phone: c.phone || "",
                    address: c.address || "",
                    notes: c.notes || "",
                    customer_type: c.customer_type || "Regular",
                  });
                  setShowForm(true);
                }}>
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-green-600 hover:text-green-800" onClick={() => openProductModal(c.id)}>
                  <Plus className="h-4 w-4" /> Products
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
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
                {/* Add products widget */}
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
                  <button type="button" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 ml-2"
                    onClick={() => setShowProductModal(false)}>Done</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default RegularCustomersSection;
