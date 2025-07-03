
import React, { useState } from "react";
import { X, Save, Upload, Palette, FileText, MapPin, Clock, Building, Info } from "lucide-react";
import { useCompanyInfo } from "../contexts/CompanyInfoContext";

const AdminInfoDialog = () => {
  const { companyInfo, updateCompanyInfo } = useCompanyInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [formData, setFormData] = useState({
    ...companyInfo,
    bankDetails: companyInfo.bankDetails || {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: ''
    },
    paymentTerms: companyInfo.paymentTerms || 'Cash',
    dispatchThrough: companyInfo.dispatchThrough || '',
    destination: companyInfo.destination || '',
    deliveryTerms: companyInfo.deliveryTerms || ''
  });

  const handleSave = () => {
    updateCompanyInfo(formData);
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { 
        ...(prev[parent as keyof typeof prev] as object || {}), 
        [field]: value 
      }
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        <Info className="h-4 w-4 mr-2" />
        Business Info
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Building className="mr-3 h-6 w-6 text-blue-600" />
            Business Configuration
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'company', label: 'Company Info', icon: Building },
            { id: 'invoice', label: 'Invoice Appearance', icon: Palette },
            { id: 'content', label: 'Invoice Content', icon: FileText },
            { id: 'location', label: 'Location & Hours', icon: MapPin },
            { id: 'banking', label: 'Banking Details', icon: Building }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Company Info Tab */}
          {activeTab === "company" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange("gstin", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    State Code & Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.stateCode}
                      onChange={(e) => handleInputChange("stateCode", e.target.value)}
                      placeholder="29"
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      value={formData.stateName}
                      onChange={(e) => handleInputChange("stateName", e.target.value)}
                      placeholder="Karnataka"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Appearance Tab */}
          {activeTab === "invoice" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Color Preset
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'light', name: 'Light', colors: { primary: '#3B82F6', accent: '#10B981', text: '#374151' } },
                    { id: 'classic', name: 'Classic', colors: { primary: '#1e3a8a', accent: '#dc2626', text: '#333' } },
                    { id: 'dark', name: 'Dark', colors: { primary: '#1F2937', accent: '#F59E0B', text: '#111827' } },
                    { id: 'custom', name: 'Custom', colors: formData.invoiceColors }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        handleInputChange("invoiceColorPreset", preset.id);
                        if (preset.id !== 'custom') {
                          handleInputChange("invoiceColors", preset.colors);
                        }
                      }}
                      className={`p-3 rounded-lg border-2 ${
                        formData.invoiceColorPreset === preset.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex space-x-1 mb-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.colors.primary }}></div>
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.colors.accent }}></div>
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.colors.text }}></div>
                      </div>
                      <span className="text-sm font-medium">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.invoiceColorPreset === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={formData.invoiceColors.primary}
                      onChange={(e) => handleNestedInputChange("invoiceColors", "primary", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Accent Color
                    </label>
                    <input
                      type="color"
                      value={formData.invoiceColors.accent}
                      onChange={(e) => handleNestedInputChange("invoiceColors", "accent", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={formData.invoiceColors.text}
                      onChange={(e) => handleNestedInputChange("invoiceColors", "text", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showWatermark"
                  checked={formData.showWatermark}
                  onChange={(e) => handleInputChange("showWatermark", e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showWatermark" className="text-sm text-gray-700 dark:text-gray-300">
                  Show company watermark on invoices
                </label>
              </div>
            </div>
          )}

          {/* Invoice Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Invoice Footer Text
                </label>
                <input
                  type="text"
                  value={formData.footer}
                  onChange={(e) => handleInputChange("footer", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Terms & Conditions
                </label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => handleInputChange("terms", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Declaration Statement
                </label>
                <textarea
                  value={formData.declaration}
                  onChange={(e) => handleInputChange("declaration", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Authorized Signatory
                </label>
                <input
                  type="text"
                  value={formData.authorizedSignatory}
                  onChange={(e) => handleInputChange("authorizedSignatory", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  HSN Code Template
                </label>
                <input
                  type="text"
                  value={formData.hsnTemplate || ''}
                  onChange={(e) => handleInputChange("hsnTemplate", e.target.value)}
                  placeholder="HSN/SAC codes as per GST guidelines"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment & Dispatch Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Mode/Terms of Payment
                    </label>
                    <input
                      type="text"
                      value={formData.paymentTerms || ''}
                      onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                      placeholder="Cash"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Dispatch Through
                    </label>
                    <input
                      type="text"
                      value={formData.dispatchThrough || ''}
                      onChange={(e) => handleInputChange("dispatchThrough", e.target.value)}
                      placeholder="Transport method"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={formData.destination || ''}
                      onChange={(e) => handleInputChange("destination", e.target.value)}
                      placeholder="Delivery destination"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Terms of Delivery
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryTerms || ''}
                      onChange={(e) => handleInputChange("deliveryTerms", e.target.value)}
                      placeholder="Delivery terms"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location & Hours Tab */}
          {activeTab === "location" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Business Hours
                </label>
                <textarea
                  value={formData.businessHours}
                  onChange={(e) => handleInputChange("businessHours", e.target.value)}
                  rows={3}
                  placeholder="Monday - Saturday: 9:00 AM - 7:00 PM&#10;Sunday: 10:00 AM - 5:00 PM"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Location Description
                </label>
                <input
                  type="text"
                  value={formData.locationDescription || ''}
                  onChange={(e) => handleInputChange("locationDescription", e.target.value)}
                  placeholder="Shreeram Building, Nadigalli, SIRSI"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Directions
                </label>
                <textarea
                  value={formData.directions || ''}
                  onChange={(e) => handleInputChange("directions", e.target.value)}
                  rows={2}
                  placeholder="Located near Main Market, parking available."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Google Maps Embed URL
                </label>
                <input
                  type="url"
                  value={formData.mapEmbedUrl || ''}
                  onChange={(e) => handleInputChange("mapEmbedUrl", e.target.value)}
                  placeholder="https://maps.google.com/embed?..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Banking Details Tab */}
          {activeTab === "banking" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.bankName || ''}
                    onChange={(e) => handleNestedInputChange("bankDetails", "bankName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.accountNumber || ''}
                    onChange={(e) => handleNestedInputChange("bankDetails", "accountNumber", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter account number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.ifscCode || ''}
                    onChange={(e) => handleNestedInputChange("bankDetails", "ifscCode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter IFSC code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={formData.bankDetails?.branch || ''}
                    onChange={(e) => handleNestedInputChange("bankDetails", "branch", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter branch name"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminInfoDialog;
