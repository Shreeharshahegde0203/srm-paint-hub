
import React, { useState } from 'react';
import { X, Upload, Plus, Minus, Eye } from 'lucide-react';
import { Product } from '../data/products';

const BRANDS = ['Dulux', 'Indigo'];
const CATEGORIES = [
  'Interior Paint',
  'Exterior Paint', 
  'Primer',
  'Distemper',
  'Putty',
  'Gloss Paints',
  'Brush',
  'Roller',
  'Other Accessories'
];
const UNIT_TYPES = ['Litre', 'Kg', 'Inch', 'Number', 'Piece'];

interface EnhancedProductFormProps {
  product?: Product | null;
  onSave: (product: Omit<Product, 'id'> & { hsn_code?: string }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const EnhancedProductForm = ({ product, onSave, onCancel, isEditing = false }: EnhancedProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || 'Dulux',
    type: product?.type || '',
    base: product?.base || '',
    category: (product as any)?.category || 'Interior Paint',
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
  const [showImagePreview, setShowImagePreview] = useState(false);

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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
            <X className="h-8 w-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Product Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                📋 Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-lg ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="e.g., Premium Emulsion"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Brand *</label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Product Type *</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-lg ${errors.type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="e.g., Emulsion, Enamel, Primer"
                />
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Base (Optional)</label>
                <input
                  type="text"
                  value={formData.base}
                  onChange={(e) => setFormData(prev => ({ ...prev, base: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., White, Deep Base, Tintable"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">HSN Code</label>
                <input
                  type="text"
                  value={formData.hsn_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, hsn_code: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 3208"
                />
              </div>
            </div>

            {/* Pricing & Stock Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                💰 Pricing & Stock
              </h3>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Price per Unit (GST Included) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-lg ${errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">GST Percentage *</label>
                <select
                  value={formData.gstRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, gstRate: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Unit Type *</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {UNIT_TYPES.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Unit Quantity *</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => adjustQuantity('unit_quantity', false)}
                    className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    <Minus className="h-5 w-5" />
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
                    className={`flex-1 px-4 py-3 border-2 rounded-lg text-center text-lg ${errors.unit_quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  />
                  <button
                    type="button"
                    onClick={() => adjustQuantity('unit_quantity', true)}
                    className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {errors.unit_quantity && <p className="text-red-500 text-sm mt-1">{errors.unit_quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Available Stock *</label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => adjustQuantity('stock', false)}
                    className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg text-center text-lg ${errors.stock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  />
                  <button
                    type="button"
                    onClick={() => adjustQuantity('stock', true)}
                    className="p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>
          </div>

          {/* Description & Image */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              📝 Additional Details
            </h3>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Product description..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Product Photo URL</label>
              <div className="flex items-center space-x-3">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setShowImagePreview(!showImagePreview)}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Preview Image"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Image Preview */}
              {showImagePreview && formData.image && (
                <div className="mt-4 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview:</p>
                  <div className="flex justify-center">
                    <img 
                      src={formData.image} 
                      alt="Product Preview" 
                      className="max-w-xs max-h-48 object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'text-red-500 text-sm p-4 bg-red-50 rounded border border-red-200';
                        errorDiv.textContent = 'Unable to load image. Please check the URL.';
                        (e.target as HTMLImageElement).parentNode?.appendChild(errorDiv);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-colors shadow-lg"
            >
              {isEditing ? '💾 Update Product' : '💾 Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedProductForm;
