
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useCachedSuppliers } from "@/hooks/useCachedSuppliers";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedSupplierSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const EnhancedSupplierSelector: React.FC<EnhancedSupplierSelectorProps> = ({ value, onChange }) => {
  const { suppliers, searchSuppliers, addSupplierToCache, isLoading } = useCachedSuppliers();
  const [showAdd, setShowAdd] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  const filteredSuppliers = searchTerm ? searchSuppliers(searchTerm) : suppliers;

  useEffect(() => {
    // Set initial search term based on selected value
    if (value && suppliers.length > 0) {
      const selectedSupplier = suppliers.find(s => s.id === value);
      if (selectedSupplier) {
        setSearchTerm(selectedSupplier.name);
      }
    }
  }, [value, suppliers]);

  async function handleAddSupplier(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .insert({ name: newSupplierName })
        .select("*")
        .single();
      
      if (!error && data) {
        addSupplierToCache(data);
        onChange(data.id);
        setShowAdd(false);
        setNewSupplierName("");
        setSearchTerm(data.name);
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
    } finally {
      setAdding(false);
    }
  }

  const handleSupplierSelect = (supplier: any) => {
    onChange(supplier.id);
    setSearchTerm(supplier.name);
    setIsDropdownOpen(false);
  };

  if (showAdd) {
    return (
      <form onSubmit={handleAddSupplier} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Supplier Name"
          value={newSupplierName}
          onChange={e => setNewSupplierName(e.target.value)}
          className="border rounded p-2 flex-1"
          required
        />
        <Button type="submit" disabled={adding} size="sm">
          {adding ? "Adding…" : "Add"}
        </Button>
        <Button variant="ghost" type="button" size="sm" onClick={() => setShowAdd(false)}>
          Cancel
        </Button>
      </form>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
                if (!e.target.value) {
                  onChange("");
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pl-10 pr-4 py-2 border rounded"
            />
          </div>
          
          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto mt-1">
              {isLoading ? (
                <div className="p-3 text-gray-500 text-center">Loading suppliers...</div>
              ) : filteredSuppliers.length > 0 ? (
                filteredSuppliers.map(supplier => (
                  <div
                    key={supplier.id}
                    onClick={() => handleSupplierSelect(supplier)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{supplier.name}</div>
                    {supplier.phone && (
                      <div className="text-sm text-gray-600">{supplier.phone}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500 text-center">
                  No suppliers found
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button type="button" size="sm" variant="outline" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSupplierSelector;
