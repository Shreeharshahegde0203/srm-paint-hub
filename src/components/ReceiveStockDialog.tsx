
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Receipt, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SupplierSelector from "./SupplierSelector";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

type Product = Tables<"products">;
type Supplier = Tables<"suppliers">;

interface ReceiveStockDialogProps {
  products: Product[];
  onReceived?: () => void;
}

const ReceiveStockDialog: React.FC<ReceiveStockDialogProps> = ({ products, onReceived }) => {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [billDueDate, setBillDueDate] = useState<string>("");
  const [billFile, setBillFile] = useState<File | null>(null);
  const [receivingDate, setReceivingDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setSelectedProductId("");
    setSelectedSupplierId("");
    setQuantity(1);
    setCostPrice(0);
    setBillDueDate("");
    setBillFile(null);
    setReceivingDate("");
  };

  async function handleReceiveStock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert into inventory_receipts
      const { data: receipt, error: recErr } = await supabase
        .from("inventory_receipts")
        .insert({
          product_id: selectedProductId,
          supplier_id: selectedSupplierId,
          quantity,
          cost_price: costPrice,
          receiving_date: receivingDate || new Date().toISOString().substring(0, 10),
          bill_due_date: billDueDate || null,
        })
        .select("*")
        .single();

      if (recErr) throw recErr;

      // Update product's stock and last_received_date
      await supabase
        .from("products")
        .update({
          stock: supabase.from("products").select("stock").eq("id", selectedProductId),
          last_received_date: receivingDate || new Date().toISOString().substring(0, 10),
          cost_price: costPrice,
          supplier_id: selectedSupplierId,
        })
        .eq("id", selectedProductId);

      // Record stock movement (optional, can also be done via a trigger)
      await supabase.from("inventory_movements").insert({
        product_id: selectedProductId,
        movement_type: "in",
        quantity,
        reason: "Received via stock entry",
        related_receipt_id: receipt.id,
      });

      // Bill upload
      if (billFile) {
        const filename = `${receipt.id}_${billFile.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("bill-uploads")
          .upload(filename, billFile);

        if (uploadErr) throw uploadErr;
        // Store file_url in bill_attachments
        await supabase.from("bill_attachments").insert({
          receipt_id: receipt.id,
          file_url: uploadData.path,
        });
      }

      setLoading(false);
      toast({ title: "Stock Received!", description: "Inventory and records updated." });
      handleClose();
      if (onReceived) onReceived();
    } catch (err: any) {
      setLoading(false);
      toast({ title: "Error", variant: "destructive", description: err.message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Receive Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle><Receipt className="inline mr-2" /> Receive New Stock</DialogTitle>
          <DialogDescription>Record the arrival of new inventory and upload bill.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReceiveStock} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Product</label>
            <select
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Supplier</label>
            <SupplierSelector value={selectedSupplierId} onChange={setSelectedSupplierId} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-medium">Quantity</label>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Cost Price (Confidential)</label>
              <input type="number" min={0} value={costPrice} onChange={e => setCostPrice(Number(e.target.value))} className="w-full border rounded p-2" required />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Receiving Date</label>
            <input type="date" value={receivingDate} onChange={e => setReceivingDate(e.target.value)} className="w-full border rounded p-2" max={new Date().toISOString().slice(0,10)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Bill Due Date</label>
            <input type="date" value={billDueDate} onChange={e => setBillDueDate(e.target.value)} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Upload Bill</label>
            <input type="file" accept="application/pdf,image/*" onChange={e => setBillFile(e.target.files?.[0] || null)} className="w-full border rounded p-2" />
          </div>
          <div className="pt-3 flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Receive Stock
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveStockDialog;

