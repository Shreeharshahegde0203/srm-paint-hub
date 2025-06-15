
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Supplier = Tables<"suppliers">;

interface SupplierSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const SupplierSelector: React.FC<SupplierSelectorProps> = ({ value, onChange }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("suppliers").select("*").then(({ data }) => {
      setSuppliers(data || []);
    });
  }, []);

  async function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.from("suppliers").insert({ name: newSupplierName }).select("*").single();
    setLoading(false);
    if (!error && data) {
      setSuppliers(prev => [...prev, data]);
      onChange(data.id);
      setShowAdd(false);
      setNewSupplierName("");
    }
  }

  return showAdd ? (
    <form onSubmit={handleAddSupplier} className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Supplier Name"
        value={newSupplierName}
        onChange={e => setNewSupplierName(e.target.value)}
        className="border rounded p-2 flex-1"
        required
      />
      <Button type="submit" disabled={loading} size="sm">
        {loading ? "Adding…" : "Add"}
      </Button>
      <Button variant="ghost" type="button" size="sm" onClick={() => setShowAdd(false)}>
        Cancel
      </Button>
    </form>
  ) : (
    <div className="flex gap-2">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 border rounded p-2"
        required
      >
        <option value="">Select supplier…</option>
        {suppliers.map(sup => (
          <option key={sup.id} value={sup.id}>{sup.name}</option>
        ))}
      </select>
      <Button type="button" size="sm" variant="outline" onClick={() => setShowAdd(true)}>
        <Plus className="h-4 w-4" /> Add New
      </Button>
    </div>
  );
};

export default SupplierSelector;

