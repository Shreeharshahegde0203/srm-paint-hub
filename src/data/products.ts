
export interface Product {
  id: string;
  name: string;
  brand: string;
  type: string;
  base?: string; // Optional base field
  stock: number;
  price: number;
  gstRate: number;
  unit: string;
  image?: string;
  batchNumber?: string;
  expiryDate?: string;
  description?: string;
  hsn_code?: string;
  unit_quantity?: number;
  unit_type?: string;
}

export interface InvoiceItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
  colorCode?: string;
  base?: string;
  isReturned?: boolean;
  returnReason?: string;
}

// Allowed unit types
export const UNIT_TYPES = ['Litre', 'Kg', 'Inch', 'Piece', 'Number'] as const;
export type UnitType = typeof UNIT_TYPES[number];

// Helper function to validate quantity (whole numbers or 0.5 only)
export const isValidQuantity = (value: number): boolean => {
  return value > 0 && (Number.isInteger(value) || value % 0.5 === 0);
};
