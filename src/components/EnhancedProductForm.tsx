import React, { useState, useEffect } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProductFormData {
  name: string;
  brand: string;
  type: string;
  base: string;
  price: number;
  stock: number;
  gstRate: number;
  unit: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  hsnCode: string;
  batchNumber: string;
  expiryDate: string;
  category: string;
  image: string;
  unitQuantity: number;
}

interface EnhancedProductFormProps {
  product?: any;
  onSave: (productData: ProductFormData) => void;
  onCancel: () => void;
  isInline?: boolean;
  isEditing?: boolean;
}

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
const NON_MANDATORY_HSN_CATEGORIES = ['Brush', 'Roller', 'Other Accessories'];

const EnhancedProductForm = ({ product, onSave, onCancel, isInline = false }: EnhancedProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    brand: product?.brand || 'Dulux',
    type: product?.type || '',
    base: product?.base || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    gstRate: product?.gst_rate || 18,
    unit: product?.unit || 'Litre',
    description: product?.description || '',
    costPrice: product?.cost_price || 0,
    sellingPrice: product?.selling_price || 0,
    reorderLevel: product?.reorder_level || 10,
    hsnCode: product?.hsn_code || '',
    batchNumber: product?.batch_number || '',
    expiryDate: product?.expiry_date || '',
    category: product?.category || 'Interior Paint',
    image: product?.image || '',
    unitQuantity: product?.unit_quantity !== undefined && product?.unit_quantity !== null ? product.unit_quantity : 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [costPrice, setCostPrice] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [gstRate, setGstRate] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");

  // Helper to parse a stored unit string like "5 Litre" or malformed values like "1 1 Litre"
  const parseUnit = (unitStr?: string): { qty: string; type: string } => {
    if (!unitStr) return { qty: "1", type: "Litre" };
    const parts = unitStr.trim().split(/\s+/);
    const firstNum = parseFloat(parts[0]);
    const qty = isNaN(firstNum) ? "1" : String(firstNum);
    let typeCandidate = isNaN(firstNum) ? parts.join(' ') : parts.slice(1).join(' ');
    typeCandidate = typeCandidate.trim();

    const match = typeCandidate.match(/^(\d+(?:\.\d+)?)\s+(.*)$/);
    if (match) {
      const maybeType = match[2];
      const STANDARD_UNITS = ['Litre','Kg','Piece','Box','Gallon','Quart','Number','Inch','Meter','Sqft'];
      const maybeTypeHead = maybeType.split(/\s+/)[0];
      if (STANDARD_UNITS.includes(maybeTypeHead)) {
        typeCandidate = maybeTypeHead;
      }
    }
    if (!typeCandidate) typeCandidate = 'Litre';
    return { qty, type: typeCandidate };
  };

  const initialParsed = parseUnit(product?.unit);
  const [unitQuantity, setUnitQuantity] = useState(initialParsed.qty);
  const [unitType, setUnitType] = useState(initialParsed.type);
  const [hsnCode, setHsnCode] = useState(formData.hsnCode || "");

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  // Add useEffect to sync local state with formData on mount/edit
  useEffect(() => {
    setPrice(formData.price !== undefined ? String(formData.price) : "");
    setCostPrice(formData.costPrice !== undefined ? String(formData.costPrice) : "");
    setStock(formData.stock !== undefined ? String(formData.stock) : "");
    setGstRate(formData.gstRate !== undefined ? String(formData.gstRate) : "");
    setReorderLevel(formData.reorderLevel !== undefined ? String(formData.reorderLevel) : "");
    
    // Set unit quantity and type from product data using robust parsing
    const parsed = parseUnit(product?.unit);
    const qtyFromField = product?.unit_quantity != null ? String(product.unit_quantity) : undefined;
    setUnitQuantity(qtyFromField ?? parsed.qty);
    setUnitType(parsed.type);
    
    setHsnCode(formData.hsnCode || "");
  }, [product, formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.brand && !NON_MANDATORY_HSN_CATEGORIES.includes(formData.category)) {
      newErrors.brand = 'Brand is required';
    }
    
    // HSN Code is no longer mandatory
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Create the bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'product-images');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('product-images', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 1024 * 1024 * 2 // 2MB
        });
      }

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      setImagePreview(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 2MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload immediately
      handleImageUpload(file);
    }
  };

  const handleIncrement = (value: string, setValue: (v: string) => void) => {
    const num = value === "" ? 0 : parseFloat(value);
    setValue(String(num + 1));
  };
  const handleDecrement = (value: string, setValue: (v: string) => void) => {
    const num = value === "" ? 0 : parseFloat(value);
    setValue(String(Math.max(0, num - 1)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const safeCostPrice = costPrice === "" ? 0 : parseFloat(costPrice);
      const safePrice = price === "" ? 0 : parseFloat(price);
      const safeStock = stock === "" ? 0 : parseFloat(stock);
      const safeGstRate = gstRate === "" ? 0 : parseFloat(gstRate);
      const safeReorderLevel = reorderLevel === "" ? 0 : parseFloat(reorderLevel);
      const safeUnitQuantity = unitQuantity === "" ? 1 : parseFloat(unitQuantity);

      onSave({
        ...formData,
        costPrice: safeCostPrice,
        price: safePrice,
        stock: safeStock,
        gstRate: safeGstRate,
        reorderLevel: safeReorderLevel,
        unitQuantity: safeUnitQuantity,
        unit: unitType,
        hsnCode: hsnCode
      });
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Brand</label>
            {NON_MANDATORY_HSN_CATEGORIES.includes(formData.category) ? (
              <input
                type="text"
                value={formData.brand}
                onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white ${errors.brand ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'}`}
                placeholder="Enter brand (optional)"
              />
            ) : (
              <select
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white ${errors.brand ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'}`}
              >
                <option value="">Select Brand</option>
                {BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            )}
            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Base</label>
            <input
              type="number"
              value={formData.base}
              onChange={(e) => setFormData(prev => ({ ...prev, base: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white"
              placeholder="e.g., 0.5, 1.0"
              min="0"
              step="0.01"
            />
          </div>

        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Product Image</h4>
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Upload Image from Device
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  {uploading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Click to upload image</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  JPG, PNG up to 2MB
                </p>
              </label>
            </div>
          </div>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="w-32 h-32">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Pricing & Inventory</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cost Price</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white">
              <button
                type="button"
                onClick={() => handleDecrement(costPrice, setCostPrice)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                -
              </button>
              <input
                type="text"
                value={costPrice}
                onChange={e => {
                  setCostPrice(e.target.value);
                  setFormData(prev => ({ ...prev, costPrice: e.target.value === "" ? 0 : parseFloat(e.target.value) }));
                }}
                className="flex-1 px-3 py-2 text-center border-none dark:bg-gray-600 dark:text-white"
                placeholder="0.00"
              />
              <button
                type="button"
                onClick={() => handleIncrement(costPrice, setCostPrice)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Selling Price *</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white">
              <button
                type="button"
                onClick={() => handleDecrement(price, setPrice)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                -
              </button>
              <input
                type="text"
                value={price}
                onChange={e => {
                  setPrice(e.target.value);
                  setFormData(prev => ({ ...prev, price: e.target.value === "" ? 0 : parseFloat(e.target.value) }));
                }}
                className={`flex-1 px-3 py-2 text-center border-none dark:bg-gray-600 dark:text-white ${
                  errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
                }`}
                placeholder="0.00"
              />
              <button
                type="button"
                onClick={() => handleIncrement(price, setPrice)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                +
              </button>
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Stock *</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white">
              <button
                type="button"
                onClick={() => handleDecrement(stock, setStock)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                -
              </button>
              <input
                type="text"
                value={stock}
                onChange={e => {
                  setStock(e.target.value);
                  setFormData(prev => ({ ...prev, stock: e.target.value === "" ? 0 : parseFloat(e.target.value) }));
                }}
                className={`flex-1 px-3 py-2 text-center border-none dark:bg-gray-600 dark:text-white ${
                  errors.stock ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'
                }`}
                placeholder="0"
              />
              <button
                type="button"
                onClick={() => handleIncrement(stock, setStock)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                +
              </button>
            </div>
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">GST Rate (%)</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white">
              <button
                type="button"
                onClick={() => handleDecrement(gstRate, setGstRate)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                -
              </button>
              <input
                type="text"
                value={gstRate}
                onChange={e => {
                  setGstRate(e.target.value);
                  setFormData(prev => ({ ...prev, gstRate: e.target.value === "" ? 0 : parseFloat(e.target.value) }));
                }}
                className="flex-1 px-3 py-2 text-center border-none dark:bg-gray-600 dark:text-white"
                placeholder="18"
              />
              <button
                type="button"
                onClick={() => handleIncrement(gstRate, setGstRate)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Reorder Level</label>
            <div className="flex items-center border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white">
              <button
                type="button"
                onClick={() => handleDecrement(reorderLevel, setReorderLevel)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                -
              </button>
              <input
                type="text"
                value={reorderLevel}
                onChange={e => {
                  setReorderLevel(e.target.value);
                  setFormData(prev => ({ ...prev, reorderLevel: e.target.value === "" ? 0 : parseFloat(e.target.value) }));
                }}
                className="flex-1 px-3 py-2 text-center border-none dark:bg-gray-600 dark:text-white"
                placeholder="10"
              />
              <button
                type="button"
                onClick={() => handleIncrement(reorderLevel, setReorderLevel)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                +
              </button>
            </div>
          </div>

           <div>
             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Unit Quantity</label>
             <div className="flex items-center border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white">
               <button
                 type="button"
                 onClick={() => handleDecrement(unitQuantity, setUnitQuantity)}
                 className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
               >
                 -
               </button>
               <input
                 type="number"
                 step="0.5"
                 min="0.5"
                 inputMode="decimal"
                 value={unitQuantity}
                 onChange={e => {
                   setUnitQuantity(e.target.value);
                   setFormData(prev => ({ ...prev, unitQuantity: e.target.value === "" ? 0 : parseFloat(e.target.value) }));
                 }}
                 onBlur={() => {
                   setUnitQuantity((v) => {
                     const n = parseFloat(String(v));
                     const clamped = isNaN(n) ? 0.5 : Math.max(0.5, n);
                     setFormData(prev => ({ ...prev, unitQuantity: clamped }));
                     return String(clamped);
                   });
                 }}
                 className="flex-1 px-3 py-2 text-center border-none dark:bg-gray-600 dark:text-white"
                 placeholder="1"
               />
               <button
                 type="button"
                 onClick={() => handleIncrement(unitQuantity, setUnitQuantity)}
                 className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
               >
                 +
               </button>
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Unit Type</label>
             <select
               value={unitType}
               onChange={e => {
                 setUnitType(e.target.value);
                 setFormData(prev => ({ ...prev, unit_type: e.target.value }));
               }}
               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white"
             >
               {UNIT_TYPES.map(unitTypeOption => (
                 <option key={unitTypeOption} value={unitTypeOption}>{unitTypeOption}</option>
               ))}
             </select>
           </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Additional Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">HSN Code{!NON_MANDATORY_HSN_CATEGORIES.includes(formData.category) && ' *'}</label>
            <input
              type="text"
              value={hsnCode}
              onChange={e => {
                setHsnCode(e.target.value);
                setFormData(prev => ({ ...prev, hsnCode: e.target.value }));
              }}
              className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:text-white ${errors.hsnCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-500'}`}
              placeholder="e.g., 3208"
            />
            {errors.hsnCode && <p className="text-red-500 text-sm mt-1">{errors.hsnCode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Batch Number</label>
            <input
              type="text"
              value={formData.batchNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white"
              placeholder="Batch number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-lg dark:bg-gray-600 dark:text-white"
            rows={3}
            placeholder="Product description"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
        >
          Cancel
        </button>
         <button
           type="submit"
           disabled={uploading}
           className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg disabled:opacity-50"
         >
           {uploading ? 'Uploading...' : (product?.id ? 'Update Product' : 'Save Product')}
         </button>
         {product?.id && (
           <button
             type="button"
             onClick={() => {/* TODO: Implement restock functionality */}}
             className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-lg"
           >
             Restock
           </button>
         )}
      </div>
    </form>
  );

  if (isInline) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product Information</h3>
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {product?.id ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
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

export default EnhancedProductForm;

