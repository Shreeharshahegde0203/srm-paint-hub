import React, { useState } from "react";
import { useRegularCustomers } from "@/hooks/useRegularCustomers";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import CustomerDetailModal from "./CustomerDetailModal";
import CustomerForm from "./CustomerForm";
import CustomerListItem from "./CustomerListItem";
import ProductModal from "./ProductModal";
import CustomerHistoryModal from "./CustomerHistoryModal";
import RegularCustomerSidebar from "./RegularCustomerSidebar";

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

  // State for customer invoice history modal
  const [historyCustomerId, setHistoryCustomerId] = useState<string | null>(null);

  // Add state for sidebar
  const [sidebarCustomer, setSidebarCustomer] = useState<any>(null);

  const handleAddOrEditCustomer = async (formData: any, isAddMode: boolean, customer: any) => {
    if (isAddMode) {
      await addCustomer({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        customer_type: formData.customer_type,
      });
      toast({ title: "Regular Customer Added" });
    } else if (customer) {
      await updateCustomer({ id: customer.id, customer: formData });
      toast({ title: "Regular Customer Updated" });
    }
    setShowForm(false);
    setEditingCustomer(null);
    setForm({ name: "", phone: "", address: "", notes: "", customer_type: "Regular" });
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setAddMode(false);
    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
      address: customer.address || "",
      notes: customer.notes || "",
      customer_type: customer.customer_type || "Regular",
    });
    setShowForm(true);
  };

  const openProductModal = async (customerId: string) => {
    setCurrentCustomerId(customerId);
    setProductLoading(true);
    try {
      const list = await getCustomerProducts(customerId);
      setCustomerProducts(list || []);
      setShowProductModal(true);
    } finally {
      setProductLoading(false);
    }
  };

  const handleAddProductMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomerId) return;
    await addProductMapping({ customerId: currentCustomerId, productId: newProductId, rate: newProductRate });
    toast({ title: "Product added/updated" });
    // refetch
    const list = await getCustomerProducts(currentCustomerId);
    setCustomerProducts(list || []);
  };

  const handleDeleteMapping = async (productId: string) => {
    if (!currentCustomerId) return;
    await deleteProductMapping({ customerId: currentCustomerId, productId });
    toast({ title: "Removed Product from Customer" });
    setCustomerProducts(customerProducts.filter(cp => cp.product_id !== productId));
  };

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

      {/* Add/Edit Customer Form */}
      {showForm && (
        <CustomerForm
          form={form}
          setForm={setForm}
          addMode={addMode}
          onSubmit={handleAddOrEditCustomer}
          onCancel={() => setShowForm(false)}
          editingCustomer={editingCustomer}
        />
      )}

      {/* Customers List */}
      {customersLoading ? (
        <div className="text-gray-500">Loading…</div>
      ) : (
        <div className="space-y-2">
          {customers.map((customer) => (
            <CustomerListItem
              key={customer.id}
              customer={customer}
              onEdit={handleEditCustomer}
              onViewDetails={setSelectedCustomer}
              onOpenProductModal={openProductModal}
              // Sidebar opens on name click
              onNameClick={() => setSidebarCustomer(customer)}
            />
          ))}
        </div>
      )}

      {/* Sidebar for detailed view */}
      <RegularCustomerSidebar
        customer={sidebarCustomer}
        open={!!sidebarCustomer}
        onClose={() => setSidebarCustomer(null)}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        customerProducts={customerProducts}
        products={products || []}
        newProductId={newProductId}
        setNewProductId={setNewProductId}
        newProductRate={newProductRate}
        setNewProductRate={setNewProductRate}
        onAddProductMapping={handleAddProductMapping}
        onDeleteMapping={handleDeleteMapping}
        productLoading={productLoading}
      />

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* Invoice history modal */}
      {historyCustomerId && (
        <CustomerHistoryModal
          customerId={historyCustomerId}
          onClose={() => setHistoryCustomerId(null)}
        />
      )}
    </div>
  );
};

export default RegularCustomersSection;
