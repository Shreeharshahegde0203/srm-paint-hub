
import React, { useState } from "react";
import { usePaintProductsCatalog, PaintProduct } from "@/hooks/usePaintProductsCatalog";
import { toast } from "@/hooks/use-toast";

const initialState: Omit<PaintProduct, "id" | "created_at"> = {
  code: "",
  name: "",
  brand: "",
  type: "",
  default_price: 0,
  description: "",
  color: "",
};

export default function AddPaintProductForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const { addProduct } = usePaintProductsCatalog();
  const BRAND_OPTIONS = ["Dulux", "Indigo", "Fomo", "Other"] as const;
  const [brandOption, setBrandOption] = useState<typeof BRAND_OPTIONS[number]>("Dulux");
  const [otherBrand, setOtherBrand] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "default_price" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const brandToSave = brandOption === 'Other' ? (otherBrand || '').trim() : brandOption;
    const payload = { ...form, brand: brandToSave } as typeof form;
    if (!payload.code || !payload.name || !payload.brand || !payload.type) {
      toast({ title: "Missing required fields", variant: "destructive" });
      setLoading(false);
      return;
    }
    try {
      await addProduct(payload);
      toast({ title: "Product added!" });
      setForm(initialState);
      setBrandOption('Dulux');
      setOtherBrand('');
      onClose?.();
    } catch (error: any) {
      toast({ title: "Error", description: error?.message ?? "Could not add product", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 max-w-lg mx-auto mt-8 space-y-4 transition-colors">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Add Product (Catalog)</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Product Code *</label>
          <input name="code" type="text" required value={form.code} onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Product Name *</label>
          <input name="name" type="text" required value={form.name} onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Brand *</label>
          <select
            value={brandOption}
            onChange={(e) => {
              const value = e.target.value as typeof BRAND_OPTIONS[number];
              setBrandOption(value);
            }}
            className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
            required
          >
            {BRAND_OPTIONS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {brandOption === 'Other' && (
            <input
              name="brand"
              type="text"
              required
              value={otherBrand}
              onChange={(e) => setOtherBrand(e.target.value)}
              className="mt-2 w-full p-2 border rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors"
              placeholder="Enter brand"
            />
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Type *</label>
          <input name="type" type="text" required value={form.type} onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Default Price *</label>
          <input name="default_price" type="number" required value={form.default_price} min={0} onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Color</label>
          <input name="color" type="text" value={form.color} onChange={handleChange}
            className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={2}
          className="w-full p-2 border rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 transition-colors" />
      </div>
      <div className="flex gap-3 pt-3">
        <button type="submit" className="flex-1 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700"
          disabled={loading}>
          Add Product
        </button>
        {onClose && (
          <button type="button" onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
