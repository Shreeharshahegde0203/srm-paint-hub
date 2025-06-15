import React from "react";
import { Edit, Plus, Eye } from "lucide-react";

interface CustomerListItemProps {
  customer: any;
  onEdit: (customer: any) => void;
  onViewDetails: (customer: any) => void;
  onOpenProductModal: (customerId: string) => void;
  onNameClick?: (customer: any) => void;
}

const CustomerListItem = ({
  customer,
  onEdit,
  onViewDetails,
  onOpenProductModal,
  onNameClick
}: CustomerListItemProps) => {
  return (
    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700">
      <div>
        <div
          className="font-medium text-gray-900 dark:text-white hover:underline hover:cursor-pointer"
          title="Click for invoice history"
          onClick={onNameClick ? () => onNameClick(customer) : undefined}
        >
          {customer.name}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300">
          {customer.phone} | {customer.address}
        </div>
        <div className="text-xs text-gray-400">
          Type: {customer.customer_type} | {customer.notes}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button 
          className="text-blue-600 hover:text-blue-800" 
          onClick={() => onViewDetails(customer)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button 
          className="text-gray-600 hover:text-gray-800" 
          onClick={() => onEdit(customer)}
        >
          <Edit className="h-4 w-4" />
        </button>
        <button 
          className="text-green-600 hover:text-green-800" 
          onClick={() => onOpenProductModal(customer.id)}
        >
          <Plus className="h-4 w-4" /> Products
        </button>
      </div>
    </div>
  );
};

export default CustomerListItem;
