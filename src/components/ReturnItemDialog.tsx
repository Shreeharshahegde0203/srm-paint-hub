import React, { useState } from 'react';
import { X, RotateCcw, Plus, Minus } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface ReturnItemDialogProps {
  onReturn: (itemData: any) => void;
  onClose: () => void;
  availableProducts: any[];
}

const RETURN_REASONS = [
  'Defective Product',
  'Wrong Color',
  'Wrong Product',
  'Customer Changed Mind',
  'Damaged in Transit',
  'Other'
];

const ReturnItemDialog = ({ onReturn, onClose, availableProducts }: ReturnItemDialogProps) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(0.5);
  const [returnReason, setReturnReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const adjustQuantity = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => prev + 0.5);
    } else {
      setQuantity(prev => Math.max(0.5, prev - 0.5));
    }
  };

  const handleReturn = () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product to return",
        variant: "destructive",
      });
      return;
    }

    if (!returnReason) {
      toast({
        title: "Error",
        description: "Please select a return reason",
        variant: "destructive",
      });
      return;
    }

    if (returnReason === 'Other' && !customReason.trim()) {
      toast({
        title: "Error",
        description: "Please specify the return reason",
        variant: "destructive",
      });
      return;
    }

    const returnData = {
      product: selectedProduct,
      quantity,
      returnReason: returnReason === 'Other' ? customReason : returnReason,
      isReturned: true
    };

    onReturn(returnData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <RotateCcw className="mr-3 h-6 w-6 text-red-600" />
            Return Item
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Select Product to Return
            </label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const product = availableProducts.find(p => p.id === e.target.value);
                setSelectedProduct(product);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a product...</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.brand}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Return Quantity
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => adjustQuantity(false)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                disabled={quantity <= 0.5}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                className="w-20 px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-center focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                min="0.5"
              />
              <button
                type="button"
                onClick={() => adjustQuantity(true)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Return Reason */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Return Reason
            </label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select reason...</option>
              {RETURN_REASONS.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          {/* Custom Reason */}
          {returnReason === 'Other' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Specify Reason
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Please specify the return reason..."
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleReturn}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Process Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnItemDialog;