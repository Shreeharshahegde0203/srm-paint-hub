
import React from "react";
import { toast } from "@/hooks/use-toast";

interface CustomerFormProps {
  form: {
    name: string;
    phone: string;
    address: string;
    notes: string;
    customer_type: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    name: string;
    phone: string;
    address: string;
    notes: string;
    customer_type: string;
  }>>;
  addMode: boolean;
  onSubmit: (form: any, addMode: boolean, editingCustomer: any) => Promise<void>;
  onCancel: () => void;
  editingCustomer: any;
}

const CustomerForm = ({ form, setForm, addMode, onSubmit, onCancel, editingCustomer }: CustomerFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(form, addMode, editingCustomer);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md transition-colors">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onClick={onCancel}
            >Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
