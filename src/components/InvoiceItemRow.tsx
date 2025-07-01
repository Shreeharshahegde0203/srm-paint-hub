
import React, { useState } from 'react';
import { Trash2, RotateCcw, Edit3, Check, X } from 'lucide-react';
import { InvoiceItem, isValidQuantity, UNIT_TYPES } from '../data/products';

interface InvoiceItemRowProps {
  item: InvoiceItem;
  index: number;
  onUpdateItem: (index: number, updates: Partial<InvoiceItem>) => void;
  onRemoveItem: (index: number) => void;
  onReturnItem: (index: number, reason?: string) => void;
  billType: 'gst' | 'non_gst' | 'casual';
}

const InvoiceItemRow = ({ 
  item, 
  index, 
  onUpdateItem, 
  onRemoveItem, 
  onReturnItem,
  billType 
}: InvoiceItemRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    colorCode: item.colorCode || '',
    base: item.base || ''
  });

  const handleSaveEdit = () => {
    if (!isValidQuantity(editValues.quantity)) {
      alert('Quantity must be whole numbers or 0.5 only');
      return;
    }

    onUpdateItem(index, {
      quantity: editValues.quantity,
      unitPrice: editValues.unitPrice,
      colorCode: editValues.colorCode,
      base: editValues.base,
      total: editValues.quantity * editValues.unitPrice
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditValues({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      colorCode: item.colorCode || '',
      base: item.base || ''
    });
    setIsEditing(false);
  };

  const handleReturn = () => {
    const reason = prompt('Return reason (optional):');
    onReturnItem(index, reason || undefined);
  };

  const priceExcludingGST = billType === 'gst' ? item.unitPrice / (1 + item.product.gstRate / 100) : item.unitPrice;

  return (
    <tr className={`${item.isReturned ? 'bg-red-50 text-red-800' : ''}`}>
      <td className="px-4 py-3 border-b">
        <div>
          <p className="font-medium">
            {item.product.name}
            {item.isReturned && <span className="text-red-600 ml-2">(RETURNED)</span>}
          </p>
          {(item.base || item.colorCode) && (
            <p className="text-sm text-gray-500">
              {item.base && `Base: ${item.base}`}
              {item.base && item.colorCode && ' | '}
              {item.colorCode && `Color: ${item.colorCode}`}
            </p>
          )}
          {item.product.hsn_code && (
            <p className="text-xs text-gray-400">HSN: {item.product.hsn_code}</p>
          )}
          {item.isReturned && item.returnReason && (
            <p className="text-xs text-red-600">Reason: {item.returnReason}</p>
          )}
        </div>
      </td>
      
      <td className="px-4 py-3 border-b text-center">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editValues.base}
              onChange={(e) => setEditValues({...editValues, base: e.target.value})}
              className="w-20 px-2 py-1 border rounded text-center"
              placeholder="Base"
            />
          </div>
        ) : (
          item.base || '-'
        )}
      </td>

      <td className="px-4 py-3 border-b text-center">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editValues.colorCode}
              onChange={(e) => setEditValues({...editValues, colorCode: e.target.value})}
              className="w-20 px-2 py-1 border rounded text-center"
              placeholder="Color"
            />
          </div>
        ) : (
          item.colorCode || '-'
        )}
      </td>
      
      <td className="px-4 py-3 border-b text-center">
        {isEditing ? (
          <input
            type="number"
            step="0.5"
            value={editValues.quantity}
            onChange={(e) => setEditValues({...editValues, quantity: parseFloat(e.target.value) || 0})}
            className="w-20 px-2 py-1 border rounded text-center"
          />
        ) : (
          item.quantity
        )}
      </td>
      
      <td className="px-4 py-3 border-b text-center">{item.product.unit}</td>
      
      {billType !== 'casual' && (
        <td className="px-4 py-3 border-b text-right">
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={editValues.unitPrice}
              onChange={(e) => setEditValues({...editValues, unitPrice: parseFloat(e.target.value) || 0})}
              className="w-24 px-2 py-1 border rounded text-right"
            />
          ) : (
            `₹${billType === 'gst' ? priceExcludingGST.toFixed(2) : item.unitPrice.toFixed(2)}`
          )}
        </td>
      )}
      
      {billType !== 'casual' && (
        <td className="px-4 py-3 border-b text-right font-semibold">
          ₹{(item.isReturned ? -item.total : item.total).toFixed(2)}
        </td>
      )}
      
      <td className="px-4 py-3 border-b">
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="text-green-600 hover:text-green-800"
                title="Save changes"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-600 hover:text-red-800"
                title="Cancel editing"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit item"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              {!item.isReturned && (
                <button
                  onClick={handleReturn}
                  className="text-orange-600 hover:text-orange-800"
                  title="Return item"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onRemoveItem(index)}
                className="text-red-600 hover:text-red-800"
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default InvoiceItemRow;
