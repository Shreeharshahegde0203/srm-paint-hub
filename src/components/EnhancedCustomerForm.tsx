
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Customer {
  id?: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  customer_number?: string;
  gstin?: string;
}

interface EnhancedCustomerFormProps {
  customer?: Customer | null;
  onSave: (customer: Omit<Customer, 'id'>) => void;
  onCancel: () => void;
  isInline?: boolean;
}

const EnhancedCustomerForm = ({ customer, onSave, onCancel, isInline = false }: EnhancedCustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    email: customer?.email || '',
    customer_number: customer?.customer_number || '',
    gstin: customer?.gstin || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    // Validate GSTIN format if provided
    if (formData.gstin && formData.gstin.length > 0) {
      const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinPattern.test(formData.gstin)) {
        newErrors.gstin = 'Invalid GSTIN format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Customer Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter customer name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Customer Number (Optional)</label>
          <input
            type="text"
            value={formData.customer_number}
            onChange={(e) => setFormData(prev => ({ ...prev, customer_number: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Customer ID/Number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">GSTIN (Optional)</label>
          <input
            type="text"
            value={formData.gstin}
            onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
            className={`w-full px-3 py-2 border rounded-lg ${errors.gstin ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="GST Identification Number"
            maxLength={15}
          />
          {errors.gstin && <p className="text-red-500 text-sm mt-1">{errors.gstin}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={3}
          placeholder="Complete address"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {customer?.id ? 'Update Customer' : 'Save Customer'}
        </button>
      </div>
    </form>
  );

  if (isInline) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {customer?.id ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {formContent}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCustomerForm;
