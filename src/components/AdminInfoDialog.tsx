import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { useCompanyInfo } from "../contexts/CompanyInfoContext";
import InvoiceTemplatePreview from "./InvoiceTemplatePreview";
import { Info, Settings2, Palette } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { cn } from "@/lib/utils";

const COLOR_PRESETS = [
  {
    key: "light",
    name: "Light",
    primary: "#2563eb",
    accent: "#22c55e",
    text: "#222",
  },
  {
    key: "classic",
    name: "Classic",
    primary: "#1e3a8a",
    accent: "#dc2626",
    text: "#333",
  },
  {
    key: "dark",
    name: "Dark",
    primary: "#1e293b",
    accent: "#dc2626",
    text: "#e5e7eb",
  },
  {
    key: "custom",
    name: "Custom",
  }
];

function groupLabel(Icon, label: string) {
  return (
    <div className="flex items-center gap-2 text-lg font-semibold mb-1">
      <Icon className="w-5 h-5 text-blue-600" />
      <span>{label}</span>
    </div>
  );
}

export default function AdminInfoDialog() {
  const { companyInfo, updateCompanyInfo } = useCompanyInfo();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState({ ...companyInfo });
  const [previewKey, setPreviewKey] = useState(Date.now());
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // Log dialog open changes for debugging
  React.useEffect(() => {
    console.log("[AdminInfoDialog] Dialog open state changed:", open);
  }, [open]);

  const handleChange = (field: string, value: any) => {
    setEdit((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleColors = (field: string, value: string) => {
    setEdit((prev: any) => ({
      ...prev,
      invoiceColors: { ...prev.invoiceColors, [field]: value },
      invoiceColorPreset: "custom"
    }));
  };

  const handlePreset = (presetKey: string) => {
    if (presetKey === "custom") {
      setEdit((prev: any) => ({
        ...prev,
        invoiceColorPreset: "custom"
      }));
      return;
    }
    const found = COLOR_PRESETS.find(c => c.key === presetKey)!;
    setEdit((prev: any) => ({
      ...prev,
      invoiceColors: {
        primary: found.primary,
        accent: found.accent,
        text: found.text,
      },
      invoiceColorPreset: presetKey,
    }));
  };

  const handleSave = () => {
    // Basic validation
    const newErrors: typeof errors = {};
    if (!edit.name?.trim()) newErrors.name = "Company name is required";
    if (!edit.address?.trim()) newErrors.address = "Address is required";
    if (!edit.phone?.trim()) newErrors.phone = "Phone is required";
    if (!edit.email?.trim()) newErrors.email = "Email is required";
    if (!edit.gstin?.trim()) newErrors.gstin = "GSTIN is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    updateCompanyInfo(edit);
    setOpen(false);
    setPreviewKey(Date.now());
  };

  // Strengthen event prevention - do everything to block navigation
  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Also prevent any default blur or focus events just in case
    if (typeof e.nativeEvent.stopImmediatePropagation === "function") {
      e.nativeEvent.stopImmediatePropagation();
    }
    console.log("[AdminInfoDialog] Info button clicked");
    setOpen(true);
    return false;
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Not inside any Link or a */}
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="ml-3 flex items-center gap-2"
            title="Edit Company Info"
            type="button"
            tabIndex={0}
            onClick={handleTriggerClick}
            data-dialog-opener="true"
            // No href, no navigation - only opens dialog
          >
            <Info className="mr-1 h-4 w-4" />
            Info
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Store & Invoice Template</DialogTitle>
            <DialogDescription>
              Manage your contact, location, and customize invoice design.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-7"
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}>
            {/* Contact Section */}
            <div>
              {groupLabel(Info, "Contact Details")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input value={edit.name} onChange={e => handleChange("name", e.target.value)} />
                  {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </div>
                <div>
                  <label className="block font-medium mb-1">Tagline</label>
                  <Input value={edit.tagline} onChange={e => handleChange("tagline", e.target.value)} />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input value={edit.address} onChange={e => handleChange("address", e.target.value)} />
                  {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input value={edit.phone} onChange={e => handleChange("phone", e.target.value)} />
                  {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input value={edit.email} onChange={e => handleChange("email", e.target.value)} type="email" />
                  {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <label className="block font-medium mb-1">
                      GSTIN <span className="text-red-500">*</span>
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer text-blue-600 ml-1">?</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        GSTIN is required and will be printed on invoices.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input value={edit.gstin} onChange={e => handleChange("gstin", e.target.value)} />
                  {errors.gstin && <span className="text-xs text-red-500">{errors.gstin}</span>}
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-1">
                    <label className="block font-medium mb-1">Logo URL</label>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-pointer text-blue-600 ml-1">?</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Paste a direct link to your business logo image. Leave blank for default.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input value={edit.logoUrl} onChange={e => handleChange("logoUrl", e.target.value)} />
                  {edit.logoUrl && (
                    <div className="mt-2">
                      <img src={edit.logoUrl} alt="logo preview" className="h-12 border rounded bg-white p-1 inline-block" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Business Hours</label>
                  <Textarea rows={2} value={edit.businessHours} onChange={e => handleChange("businessHours", e.target.value)} />
                </div>
              </div>
            </div>
            {/* Location Section */}
            <div>
              {groupLabel(Settings2, "Location & Map")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-1">
                    <label className="block font-medium mb-1">Map Embed URL</label>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-pointer text-blue-600 ml-1">?</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Optional: Google Maps or OpenStreetMap embed link, shown on the Contact page.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    placeholder="Paste Google Maps Embed URL (optional)"
                    value={edit.mapEmbedUrl ?? ""}
                    onChange={e => handleChange("mapEmbedUrl", e.target.value)}
                  />
                  <small className="text-gray-400">Leave blank to show placeholder</small>
                </div>
                <div>
                  <label className="block font-medium mb-1">Map Display Text</label>
                  <Input
                    placeholder="Label for Find Us map"
                    value={edit.mapDisplayText ?? ""}
                    onChange={e => handleChange("mapDisplayText", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Location Description</label>
                  <Textarea
                    rows={2}
                    placeholder="Describe your location (street, area, city, etc.)"
                    value={edit.locationDescription ?? ""}
                    onChange={e => handleChange("locationDescription", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Directions / Landmarks</label>
                  <Textarea
                    rows={2}
                    placeholder="Add custom directions or nearest landmarks"
                    value={edit.directions ?? ""}
                    onChange={e => handleChange("directions", e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Invoice Appearance */}
            <div>
              {groupLabel(Palette, "Invoice Appearance")}
              {/* Preset Color Picker */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-medium">Color Presets:</span>
                {COLOR_PRESETS.map(preset => (
                  <Button
                    key={preset.key}
                    type="button"
                    size="sm"
                    variant={edit.invoiceColorPreset === preset.key ? "default" : "outline"}
                    className={cn(
                      "h-7 text-xs px-2 py-0 mr-1",
                      edit.invoiceColorPreset === preset.key && "ring-2 ring-primary"
                    )}
                    onClick={() => handlePreset(preset.key)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
              {/* Show color inputs if custom */}
              <div className="flex gap-4 mb-2">
                <div>
                  <label className="block text-xs mb-1">Primary Color</label>
                  <input type="color" value={edit.invoiceColors.primary} disabled={edit.invoiceColorPreset !== "custom"} onChange={e => handleColors("primary", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Accent Color</label>
                  <input type="color" value={edit.invoiceColors.accent} disabled={edit.invoiceColorPreset !== "custom"} onChange={e => handleColors("accent", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Text Color</label>
                  <input type="color" value={edit.invoiceColors.text} disabled={edit.invoiceColorPreset !== "custom"} onChange={e => handleColors("text", e.target.value)} />
                </div>
              </div>
              {/* Watermark Toggle */}
              <div className="flex items-center gap-2 mt-2">
                <Switch checked={!!edit.showWatermark} onCheckedChange={v => handleChange("showWatermark", v)} id="watermark-toggle" />
                <label htmlFor="watermark-toggle" className="text-sm">
                  Show Company Watermark on Invoice
                </label>
              </div>
            </div>
            {/* Invoice Content Customization */}
            <div>
              {groupLabel(Palette, "Invoice Contents")}
              <div className="mb-2">
                <label className="block font-medium mb-1">HSN/SAC Template</label>
                <Input
                  value={edit.hsnTemplate ?? ""}
                  onChange={e => handleChange("hsnTemplate", e.target.value)}
                  placeholder="E.g., HSN/SAC: 3209 (Paints & Varnishes)"
                />
                <small className="text-gray-400">This info appears on every invoice. Leave blank to hide.</small>
              </div>
              <div className="mb-2">
                <label className="block font-medium mb-1">Custom Footer (lines separated by \n)</label>
                <Textarea rows={2} value={edit.footer} onChange={e => handleChange("footer", e.target.value)} />
              </div>
              <div>
                <label className="block font-medium mb-1">Terms/Conditions (lines separated by \n)</label>
                <Textarea rows={2} value={edit.terms} onChange={e => handleChange("terms", e.target.value)} />
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-between gap-2 mt-4">
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                Save & Close
              </Button>
              <Button type="button" variant="outline" onClick={() => setPreviewKey(Date.now())}>
                Preview Invoice
              </Button>
            </div>
          </form>
          {/* Preview */}
          <div className="mt-6">
            <InvoiceTemplatePreview key={previewKey} />
            {/* Will show watermark in preview if enabled & logo as well */}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
