
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { useCompanyInfo } from "../contexts/CompanyInfoContext";
import InvoiceTemplatePreview from "./InvoiceTemplatePreview";
import { Info } from "lucide-react";

export default function AdminInfoDialog() {
  const { companyInfo, updateCompanyInfo } = useCompanyInfo();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState({ ...companyInfo });
  const [previewKey, setPreviewKey] = useState(Date.now()); // force preview rerender

  const handleChange = (field: string, value: any) => {
    setEdit((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleColors = (field: string, value: string) => {
    setEdit((prev: any) => ({
      ...prev,
      invoiceColors: { ...prev.invoiceColors, [field]: value },
    }));
  };

  const handleSave = () => {
    updateCompanyInfo(edit);
    setOpen(false);
    setPreviewKey(Date.now());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-3 flex items-center gap-2" title="Edit Company Info">
          <Info className="mr-1 h-4 w-4" /> Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company Info & Invoice Template</DialogTitle>
          <DialogDescription>
            Change contact details and invoice template appearance here.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}>
          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Company Name</label>
              <input className="w-full border rounded p-2" value={edit.name} onChange={e => handleChange("name", e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Tagline</label>
              <input className="w-full border rounded p-2" value={edit.tagline} onChange={e => handleChange("tagline", e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input className="w-full border rounded p-2" value={edit.address} onChange={e => handleChange("address", e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input className="w-full border rounded p-2" value={edit.phone} onChange={e => handleChange("phone", e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input className="w-full border rounded p-2" value={edit.email} onChange={e => handleChange("email", e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">GSTIN</label>
              <input className="w-full border rounded p-2" value={edit.gstin} onChange={e => handleChange("gstin", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Logo URL (optional, leave blank for default logo)</label>
              <input className="w-full border rounded p-2" value={edit.logoUrl} onChange={e => handleChange("logoUrl", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Business Hours (lines separated by \n)</label>
              <textarea
                className="w-full border rounded p-2"
                rows={2}
                value={edit.businessHours}
                onChange={e => handleChange("businessHours", e.target.value)}
              />
            </div>
          </div>

          {/* Invoice Template */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Invoice Appearance</h4>
            <div className="flex gap-4">
              <div>
                <label className="block text-xs mb-1">Primary Color</label>
                <input type="color" value={edit.invoiceColors.primary} onChange={e => handleColors("primary", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1">Accent Color</label>
                <input type="color" value={edit.invoiceColors.accent} onChange={e => handleColors("accent", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs mb-1">Text Color</label>
                <input type="color" value={edit.invoiceColors.text} onChange={e => handleColors("text", e.target.value)} />
              </div>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1 mt-4">Custom Footer (lines separated by \n)</label>
            <textarea className="w-full border rounded p-2" rows={2} value={edit.footer} onChange={e => handleChange("footer", e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Terms/Conditions (lines separated by \n)</label>
            <textarea className="w-full border rounded p-2" rows={2} value={edit.terms} onChange={e => handleChange("terms", e.target.value)} />
          </div>

          <div className="flex justify-between gap-2 mt-4">
            <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
              Save & Close
            </Button>
            <Button type="button" variant="outline" onClick={() => {setPreviewKey(Date.now())}}>
              Preview Invoice
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <InvoiceTemplatePreview key={previewKey} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
