import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, FileUp, AlertTriangle, Upload, Image } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import SupplierSelector from './SupplierSelector';
import { toast } from "@/hooks/use-toast";
import StockLevelIcon from './StockLevelIcon';

export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  type: string;
  color: string;
  price: number;
  stock: number;
  gstRate: number;
  unit: string;
  description?: string;
  cost_price?: number;
  supplier_id?: string;
  image?: string;
  unit_quantity?: number;
  unit_type?: string;
  hsn_code?: string;
}

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductManagement = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  // Updated categories with paint-specific types
  const categories = [
    'Gloss Paint', 'Exterior Paint', 'Interior Paint', 'Distemper', 
    'Primer', 'Thinner', 'Brush', 'Roller', 'Tools', 'Accessories', 'Other'
  ];
  
  // Only Dulux and Indigo brands
  const brands = ['Dulux', 'Indigo'];
  
  // Extended unit types including inches
  const getUnitTypes = (category: string) => {
    if (['Brush', 'Roller', 'Tools', 'Accessories', 'Other'].includes(category)) {
      return ['1 Inch', '2 Inch', '3 Inch', '4 Inch', '5 Inch', '6 Inch', '7 Inch', '8 Inch', '9 Inch', '10 Inch', 'Piece'];
    }
    return ['Litre', 'Kg', 'Piece', 'Box', 'Sqft', 'Meter'];
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === '' || product.type === categoryFilter;
      const matchesBrand = brandFilter === '' || product.brand === brandFilter;
      
      return matchesSearch && matchesCategory && matchesBrand;
    })
    .sort((a, b) => (b.stock || 0) - (a.stock || 0));

  const generateProductCode = () => {
    const number = (products.length + 1).toString().padStart(3, '0');
    return `SRM${number}`;
  };

  const ProductForm = ({
    product,
    onClose,
  }: {
    product?: Product;
    onClose: () => void;
  }) => {
    const isEdit = !!product;
    const [formData, setFormData] = useState<Partial<Product>>(
      product || {
        code: generateProductCode(),
        name: '',
        brand: '',
        type: '',
        color: '',
        price: 0,
        stock: 0,
        gstRate: 18,
        unit: 'Litre',
        description: '',
        unit_quantity: 1,
        unit_type: 'Litre',
        hsn_code: '',
      }
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (file: File): Promise<string | null> => {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${formData.code}_${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        return publicUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        let imageUrl = formData.image;
        
        if (imageFile) {
          imageUrl = await handleImageUpload(imageFile);
        }

        const productData = {
          ...formData,
          image: imageUrl,
          unit: `${formData.unit_quantity} ${formData.unit_type}`,
        };

        if (!isEdit) {
          await onAddProduct(productData as Omit<Product, 'id'>);
        } else {
          await onUpdateProduct(product.id, productData);
        }
        
        toast({ title: isEdit ? "Product Updated Successfully!" : "Product Added Successfully!" });
        setLoading(false);
        onClose();
      } catch (err: any) {
        setLoading(false);
        toast({ title: "Error", variant: "destructive", description: err.message });
      }
    };

    const availableUnitTypes = getUnitTypes(formData.type || '');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto transition-colors">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Product Code</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  required
                  readOnly={isEdit}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">HSN Code</label>
                <input
                  type="text"
                  value={formData.hsn_code || ''}
                  onChange={e => setFormData({ ...formData, hsn_code: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  placeholder="e.g., 3208"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Item Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                placeholder="e.g., Dulux Velvet Touch White"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Brand Name</label>
                <select
                  value={formData.brand || ''}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Category</label>
                <select
                  value={formData.type || ''}
                  onChange={e => {
                    setFormData({ 
                      ...formData, 
                      type: e.target.value,
                      unit_type: getUnitTypes(e.target.value)[0] // Reset unit type when category changes
                    });
                  }}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Unit Quantity</label>
                <input
                  type="number"
                  value={formData.unit_quantity || 1}
                  onChange={e => setFormData({ ...formData, unit_quantity: parseFloat(e.target.value) || 1 })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  min="0.5"
                  step="0.5"
                  placeholder="e.g., 5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Unit Type</label>
                <select
                  value={formData.unit_type || availableUnitTypes[0]}
                  onChange={e => setFormData({ ...formData, unit_type: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  required
                >
                  {availableUnitTypes.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">GST (%)</label>
                <input
                  type="number"
                  value={formData.gstRate || 18}
                  onChange={e => setFormData({ ...formData, gstRate: parseFloat(e.target.value) || 18 })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="18"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Price per Unit (Excl. GST) (₹)</label>
                <input
                  type="number"
                  value={formData.price || 0}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Available Stock</label>
                <input
                  type="number"
                  value={formData.stock || 0}
                  onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  min="0"
                  step="0.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Color</label>
              <input
                type="text"
                value={formData.color || ''}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                placeholder="e.g., White, Blue, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Product Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
              {(formData.image || imageFile) && (
                <div className="mt-2">
                  <img 
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image} 
                    alt="Product preview" 
                    className="w-20 h-20 object-cover rounded border"
                    onError={(e) => {
                      console.log('Image failed to load:', formData.image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Description (optional)</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                rows={2}
                placeholder="e.g., For exterior use, weather resistant"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isEdit ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-100 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Paint Inventory Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </button>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, code, or brand..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Enhanced Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Image</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product Code</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">HSN Code</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item Name</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Brand</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">GST %</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rate/Unit (₹)</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Stock</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Alert</th>
              <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className={`hover:bg-gray-50 dark:hover:bg-slate-700 ${product.stock === 0 ? 'bg-red-50 dark:bg-red-900/20' : product.stock < 20 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded border"
                      onError={(e) => {
                        console.log('Image failed to load:', product.image);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center" style={{ display: product.image ? 'none' : 'flex' }}>
                    <Image className="h-6 w-6 text-gray-400" />
                  </div>
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm text-blue-600 dark:text-blue-400">{product.code}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm text-gray-600 dark:text-gray-400">{product.hsn_code || '-'}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-900 dark:text-white">{product.name}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-300">{product.brand}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-300">{product.type}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-300">{product.unit}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">{product.gstRate}%</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-semibold text-green-600">₹{product.price.toFixed(2)}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center font-medium">{product.stock}</td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-center">
                  {product.stock === 0 ? (
                    <span className="text-red-600 font-bold">OUT OF STOCK</span>
                  ) : product.stock < 20 ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mx-auto" />
                  ) : (
                    <span className="text-green-600">✓</span>
                  )}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 p-1 rounded"
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 p-1 rounded"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No products found. Add your first product to get started.
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200">Total Products</h3>
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900 dark:text-green-200">In Stock</h3>
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > 0).length}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">Low Stock</h3>
          <p className="text-2xl font-bold text-yellow-600">{products.filter(p => p.stock > 0 && p.stock < 20).length}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <h3 className="font-semibold text-red-900 dark:text-red-200">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductManagement;
