
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

// Sample products database for compatibility
export const productsDatabase: Product[] = [
  {
    id: "1",
    name: "Premium Emulsion",
    brand: "Dulux",
    type: "Emulsion",
    base: "White",
    stock: 50,
    price: 1200,
    gstRate: 18,
    unit: "4 Litre",
    description: "High quality interior emulsion paint"
  },
  {
    id: "2", 
    name: "Weather Shield",
    brand: "Asian Paints",
    type: "Exterior Paint",
    base: "Deep Base",
    stock: 30,
    price: 1800,
    gstRate: 18,
    unit: "4 Litre",
    description: "Weather resistant exterior paint"
  }
];
