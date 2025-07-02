
import React, { useState } from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { Product, UNIT_TYPES } from '../data/products';

interface EnhancedProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, 'id'> & { hsn_code?: string }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const EnhancedProductForm = ({ product, onSave, onCancel, isEditing = false }: EnhancedProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    type: product?.type || '',
    base: product?.base || '',
    category: (product as any)?.category || '',
    price: product?.price || 0,
    gstRate: product?.gstRate || 18,
    stock: product?.stock || 0,
    unit: product?.unit || 'Piece',
    unit_quantity: (product as any)?.unit_quantity || 1,
    description: product?.description || '',
    hsn_code: (product as any)?.hsn_code || '',
    image: product?.image || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.type.trim()) newErrors.type = 'Product type is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (formData.unit_quantity <= 0) newErrors.unit_quantity = 'Unit quantity must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const adjustQuantity = (field: 'unit_quantity' | 'stock', increment: boolean) => {
    const step = field === 'unit_quantity' ? 0.5 : 1;
    const currentValue = formData[field];
    const newValue = increment ? currentValue + step : Math.max(0, currentValue - step);
    
    // Ensure unit_quantity only allows whole numbers or 0.5
    if (field === 'unit_quantity') {
      const rounded = Math.round(newValue * 2) / 2;
      setFormData(prev => ({ ...prev, [field]: rounded }));
    } else {
      setFormData(prev => ({ ...prev, [field]: newValue }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Product Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Premium Emulsion"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brand *</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Dulux, Asian Paints"
                />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Type *</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Emulsion, Enamel, Primer"
                />
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Base (Optional)</label>
                <input
                  type="text"
                  value={formData.base}
                  onChange={(e) => setFormData(prev => ({ ...prev, base: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., White, Deep Base, Tintable"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Interior Paint, Exterior Paint"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">HSN Code</label>
                <input
                  type="text"
                  value={formData.hsn_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, hsn_code: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 3208"
                />
              </div>
            </div>

            {/* Pricing & Stock Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing & Stock</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price per Unit (GST Included) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">GST Percentage *</label>
                <select
                  value={formData.gstRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, gstRate: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Unit Type *</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {UNIT_TYPES.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Unit Quantity *</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => adjustQuantity('unit_quantity', false)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.unit_quantity}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      const rounded = Math.round(value * 2) / 2;
                      setFormData(prev => ({ ...prev, unit_quantity: rounded }));
                    }}
                    className={`flex-1 px-3 py-2 border rounded-lg text-center ${errors.unit_quantity ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => adjustQuantity('unit_quantity', true)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {errors.unit_quantity && <p className="text-red-500 text-sm mt-1">{errors.unit_quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Available Stock *</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => adjustQuantity('stock', false)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className={`flex-1 px-3 py-2 border rounded-lg text-center ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => adjustQuantity('stock', true)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>
          </div>

          {/* Description & Image */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Product Photo URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedProductForm;
