
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
  const [searchCode, setSearchCode] = useState("");
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);

  // New product form
  const [formData, setFormData] = useState<Partial<Product>>({
    code: "",
    name: "",
    brand: "",
    type: "",
    color: "",
    stock: 1,
    price: 0,
    gst_rate: 18,
    unit: "Litre",
    description: "",
    cost_price: 0,
    supplier_id: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [supplierId, setSupplierId] = useState("");
  const [costPrice, setCostPrice] = useState<number>(0);
  const [billFile, setBillFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Find product by code or name
  function handleCodeSearch() {
    const prod = products.find(
      (p) =>
        (p.code && p.code.toLowerCase() === searchCode.toLowerCase()) ||
        (p.name && p.name.toLowerCase() === searchCode.toLowerCase())
    );
    setFoundProduct(prod ?? null);
    if (!prod) {
      toast({ title: "Product not found", description: "Check code or name", variant: "destructive" });
    }
  }

  async function handleSubmitNewProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Insert new product
      const { data: inserted, error: insErr } = await supabase
        .from("products")
        .insert({
          code: formData.code,
          name: formData.name,
          brand: formData.brand,
          type: formData.type,
          color: formData.color,
          price: formData.price,
          gst_rate: formData.gst_rate ?? 18,
          unit: formData.unit ?? "Litre",
          description: formData.description || "",
          supplier_id: supplierId || null,
          cost_price: costPrice,
          stock: quantity,
        })
        .select("*")
        .single();

      if (insErr || !inserted) throw insErr || new Error("Product add failed");

      // Add inventory_receipt for opening stock
      if (quantity > 0) {
        const { data: receipt, error: recErr } = await supabase
          .from("inventory_receipts")
          .insert({
            product_id: inserted.id,
            supplier_id: supplierId || null,
            quantity,
            cost_price: costPrice,
            receiving_date: new Date().toISOString().slice(0, 10),
          })
          .select("*")
          .single();
        if (recErr) throw recErr;

        await supabase.from("inventory_movements").insert({
          product_id: inserted.id,
          movement_type: "in",
          quantity,
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
        stock: (foundProduct.stock ?? 0) + quantity,
        cost_price: costPrice,
        supplier_id: supplierId || null,
      }).eq("id", foundProduct.id);

      const { data: receipt, error: recErr } = await supabase
        .from("inventory_receipts")
        .insert({
          product_id: foundProduct.id,
          supplier_id: supplierId || null,
          quantity,
          cost_price: costPrice,
          receiving_date: new Date().toISOString().slice(0, 10),
        })
        .select("*")
        .single();
      if (recErr) throw recErr;

      await supabase.from("inventory_movements").insert({
        product_id: foundProduct.id,
        movement_type: "in",
        quantity,
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
            <input type="text" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" placeholder="Product Code" value={formData.code} required
              onChange={e => setFormData(fd => ({ ...fd, code: e.target.value }))} />
            <input type="text" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" placeholder="Name" value={formData.name} required
              onChange={e => setFormData(fd => ({ ...fd, name: e.target.value }))} />
            <input type="text" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" placeholder="Brand" value={formData.brand} required
              onChange={e => setFormData(fd => ({ ...fd, brand: e.target.value }))} />
            <input type="text" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" placeholder="Type" value={formData.type} required
              onChange={e => setFormData(fd => ({ ...fd, type: e.target.value }))} />
            <input type="text" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100" placeholder="Color" value={formData.color} required
              onChange={e => setFormData(fd => ({ ...fd, color: e.target.value }))} />
            <div className="flex gap-2">
              <div className="flex-1">
                <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Unit Price (₹)" value={formData.price} min={0} step={0.01} required
                  onChange={e => setFormData(fd => ({ ...fd, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="flex-1">
                <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Opening Qty" value={quantity} min={0} required
                  onChange={e => setQuantity(parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Cost Price" value={costPrice} min={0} step={0.01}
                  onChange={e => setCostPrice(parseFloat(e.target.value) || 0)} />
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
                placeholder="Enter Product Code or Name"
                className="flex-1 p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                value={searchCode}
                onChange={e => setSearchCode(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleCodeSearch(); } }}
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleCodeSearch}>Find</Button>
            </div>
            {foundProduct && (
              <div className="bg-gray-50 dark:bg-slate-900 border text-xs p-2 mb-2 rounded">
                <div>Code: <span className="font-bold">{foundProduct.code}</span></div>
                <div>Name: {foundProduct.name}</div>
                <div>Current Stock: <span className="text-blue-600 font-bold">{foundProduct.stock}</span></div>
                <div>Brand: {foundProduct.brand} | Type: {foundProduct.type}</div>
                <div>Price: ₹{foundProduct.price}</div>
              </div>
            )}
            {foundProduct && <>
              <div className="flex gap-2">
                <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Received Quantity" value={quantity} min={1} required
                  onChange={e => setQuantity(parseInt(e.target.value) || 0)} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input type="number" className="w-full p-2 border rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Cost Price" value={costPrice} min={0} step={0.01}
                    onChange={e => setCostPrice(parseFloat(e.target.value) || 0)} />
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
            {!foundProduct && <div className="text-sm text-gray-400 pt-2">Search product by code or name.</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default UnifiedProductEntryDialog;
