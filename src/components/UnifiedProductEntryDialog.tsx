
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SupplierSelector from "./SupplierSelector";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

interface UnifiedProductEntryDialogProps {
  products: Product[];
  onClose: () => void;
  onComplete: () => void;
}

const UnifiedProductEntryDialog: React.FC<UnifiedProductEntryDialogProps> = ({
  products,
  onClose,
  onComplete,
}) => {
  const [mode, setMode] = useState<"new" | "receive">("new");
  const [searchName, setSearchName] = useState("");
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);

  // New product form
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    brand: "Dulux",
    type: "",
    base: "",
    stock: 1,
    price: 0,
    gst_rate: 18,
    unit: "Litre",
    description: "",
    cost_price: 0,
    supplier_id: "",
  });
  const BRAND_OPTIONS = ["Dulux", "Indigo", "Fomo", "Other"] as const;
  const [brandOption, setBrandOption] = useState<typeof BRAND_OPTIONS[number]>("Dulux");
  const [otherBrand, setOtherBrand] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [billFile, setBillFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Add generic increment/decrement handlers
  const handleIncrement = (value: string, setValue: (v: string) => void) => {
    const num = value === "" ? 0 : parseFloat(value);
    setValue(String(num + 1));
  };
  const handleDecrement = (value: string, setValue: (v: string) => void) => {
    const num = value === "" ? 0 : parseFloat(value);
    setValue(String(Math.max(0, num - 1)));
  };

  // Find product by name
  function handleNameSearch() {
    const prod = products.find(
      (p) => p.name && p.name.toLowerCase() === searchName.toLowerCase()
    );
    setFoundProduct(prod ?? null);
    if (!prod) {
      toast({ title: "Product not found", description: "Check product name", variant: "destructive" });
    }
  }

  async function handleSubmitNewProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Insert new product
      const safeQuantity = quantity === "" ? 0 : parseFloat(quantity);
      const safeCostPrice = costPrice === "" ? 0 : parseFloat(costPrice);
      const safePrice = typeof formData.price === "string" ? (formData.price === "" ? 0 : parseFloat(formData.price)) : formData.price;
      const brandToUse = brandOption === 'Other' ? (otherBrand || '').trim() : brandOption;

      const { data: inserted, error: insErr } = await supabase
        .from("products")
        .insert({
          name: formData.name,
          brand: brandToUse,
          type: formData.type,
          base: formData.base,
          price: safePrice,
          gst_rate: formData.gst_rate ?? 18,
          unit: formData.unit ?? "Litre",
          description: formData.description || "",
          supplier_id: supplierId || null,
          cost_price: safeCostPrice,
          stock: safeQuantity,
        })
        .select("*")
        .single();

      if (insErr || !inserted) throw insErr || new Error("Product add failed");

      // Add inventory_receipt for opening stock
      if (safeQuantity > 0) {
        const { data: receipt, error: recErr } = await supabase
          .from("inventory_receipts")
          .insert({
            product_id: inserted.id,
            supplier_id: supplierId || null,
            quantity: safeQuantity,
            cost_price: safeCostPrice,
            receiving_date: new Date().toISOString().slice(0, 10),
          })
          .select("*")
          .single();
        if (recErr) throw recErr;

        await supabase.from("inventory_movements").insert({
          product_id: inserted.id,
          movement_type: "in",
          quantity: safeQuantity,
          reason: "Opening stock",
          related_receipt_id: receipt.id,
        });

        if (billFile) {
          const filename = `${receipt.id}_${billFile.name}`;
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from("bill-uploads")
            .upload(filename, billFile);
          if (uploadErr) throw uploadErr;
          await supabase.from("bill_attachments").insert({
            receipt_id: receipt.id,
            file_url: uploadData?.path,
          });
        }
      }
      toast({ title: "Product added & stock received." });
      setLoading(false);
      onComplete();
      onClose();
    } catch (err: any) {
      setLoading(false);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  async function handleReceiveStock(e: React.FormEvent) {
    e.preventDefault();
    if (!foundProduct) return;
    setLoading(true);
    try {
      await supabase.from("products").update({
        stock: (foundProduct.stock ?? 0) + (quantity === "" ? 0 : parseFloat(quantity)),
        cost_price: costPrice === "" ? 0 : parseFloat(costPrice),
        supplier_id: supplierId || null,
      }).eq("id", foundProduct.id);

      const safeQuantity = quantity === "" ? 0 : parseFloat(quantity);
      const safeCostPrice = costPrice === "" ? 0 : parseFloat(costPrice);

      const { data: receipt, error: recErr } = await supabase
        .from("inventory_receipts")
        .insert({
          product_id: foundProduct.id,
          supplier_id: supplierId || null,
          quantity: safeQuantity,
          cost_price: safeCostPrice,
          receiving_date: new Date().toISOString().slice(0, 10),
        })
        .select("*")
        .single();
      if (recErr) throw recErr;

      await supabase.from("inventory_movements").insert({
        product_id: foundProduct.id,
        movement_type: "in",
        quantity: safeQuantity,
        reason: "Stock received",
        related_receipt_id: receipt.id,
      });

      if (billFile) {
        const filename = `${receipt.id}_${billFile.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("bill-uploads")
          .upload(filename, billFile);
        if (uploadErr) throw uploadErr;
        await supabase.from("bill_attachments").insert({
          receipt_id: receipt.id,
          file_url: uploadData?.path,
        });
      }

      toast({ title: "Stock received & inventory updated." });
      setLoading(false);
      onComplete();
      onClose();
    } catch (err: any) {
      setLoading(false);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-2">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add / Receive Product</h2>
          <Button variant="ghost" onClick={onClose}><X /></Button>
        </div>
        <div className="mb-3 flex gap-2">
          <Button
            variant={mode === "new" ? "default" : "outline"}
            onClick={() => setMode("new")}
            size="sm"
          >Add New Product</Button>
          <Button
            variant={mode === "receive" ? "default" : "outline"}
            onClick={() => setMode("receive")}
            size="sm"
          >Receive Stock for Existing</Button>
        </div>
        {mode === "new" ? (
          <form onSubmit={handleSubmitNewProduct} className="space-y-3">
            <input type="text" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" placeholder="Product Name" value={formData.name} required
              onChange={e => setFormData(fd => ({ ...fd, name: e.target.value }))} />
            <div>
              <select
                className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                value={brandOption}
                onChange={(e) => {
                  const value = e.target.value as typeof BRAND_OPTIONS[number];
                  setBrandOption(value);
                  if (value === 'Other') {
                    setFormData(fd => ({ ...fd, brand: otherBrand }));
                  } else {
                    setFormData(fd => ({ ...fd, brand: value }));
                  }
                }}
                required
              >
                {BRAND_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {brandOption === 'Other' && (
                <input
                  type="text"
                  className="mt-2 w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter Brand"
                  value={otherBrand}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOtherBrand(value);
                    setFormData(fd => ({ ...fd, brand: value }));
                  }}
                  required
                />
              )}
            </div>
            <input type="text" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" placeholder="Type" value={formData.type} required
              onChange={e => setFormData(fd => ({ ...fd, type: e.target.value }))} />
            <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" placeholder="Base (optional)" value={formData.base}
              onChange={e => setFormData(fd => ({ ...fd, base: e.target.value }))} min="0" step="0.01" />
            <div className="flex gap-2">
              <div className="flex-1">
                <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Unit Price (₹)" value={formData.price} min={0} step={0.01} required
                  onChange={e => setFormData(fd => ({ ...fd, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="flex-1">
                <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Opening Qty" value={quantity} min={0} required
                  onChange={e => setQuantity(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Cost Price" value={costPrice} min={0} step={0.01}
                  onChange={e => setCostPrice(e.target.value)} />
              </div>
              <div className="flex-1">
                <SupplierSelector value={supplierId} onChange={setSupplierId} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold">Upload Bill (optional)</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={e => setBillFile(e.target.files?.[0] || null)}
                className="w-full text-xs px-2 py-1 rounded border"
              />
            </div>
            <textarea className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Description (optional)" value={formData.description}
              rows={2}
              onChange={e => setFormData(fd => ({ ...fd, description: e.target.value }))} />
            <button type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold mt-1"
            >Add Product</button>
          </form>
        ) : (
          <form onSubmit={handleReceiveStock} className="space-y-3">
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Enter Product Name"
                className="flex-1 p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleNameSearch(); } }}
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleNameSearch}>Find</Button>
            </div>
            {foundProduct && (
              <div className="bg-gray-50 dark:bg-slate-900 border text-xs p-2 mb-2 rounded">
                <div>Name: <span className="font-bold">{foundProduct.name}</span></div>
                <div>Current Stock: <span className="text-blue-600 font-bold">{foundProduct.stock}</span></div>
                <div>Brand: {foundProduct.brand} | Type: {foundProduct.type}</div>
                <div>Base: {foundProduct.base || 'None'}</div>
                <div>Price: ₹{foundProduct.price}</div>
              </div>
            )}
            {foundProduct && <>
              <div className="flex gap-2">
                <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Received Quantity" value={quantity} min={1} required
                  onChange={e => setQuantity(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Cost Price" value={costPrice} min={0} step={0.01}
                    onChange={e => setCostPrice(e.target.value)} />
                </div>
                <div className="flex-1">
                  <SupplierSelector value={supplierId} onChange={setSupplierId} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold">Upload Bill (optional)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={e => setBillFile(e.target.files?.[0] || null)}
                  className="w-full text-xs px-2 py-1 rounded border"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold mt-1"
              >Receive Stock</button>
            </>}
            {!foundProduct && <div className="text-sm text-gray-400 pt-2">Search product by name.</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default UnifiedProductEntryDialog;
