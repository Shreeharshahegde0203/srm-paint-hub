
export interface Product {
  id: string;
  name: string;
  brand: string;
  type: string;
  base?: string;
  price: number;
  stock: number;
  gstRate: number;
  unit: string;
  description?: string;
  image?: string;
  unit_quantity?: number;
  hsn_code?: string;
  batchNumber?: string;
  expiryDate?: string;
  category?: string;
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
  gstPercentage?: number;
  unitQuantity?: number;
  unitType?: string;
}

export const UNIT_TYPES = ['Litre', 'Kg', 'Inch', 'Number', 'Piece'];

export const isValidQuantity = (quantity: number): boolean => {
  return quantity > 0 && (quantity % 0.5 === 0);
};

export const products: Product[] = [
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
    description: "High quality interior emulsion paint",
    hsn_code: "3208"
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
    description: "Weather resistant exterior paint",
    hsn_code: "3208"
  }
];

// Legacy export for backward compatibility
export const productsDatabase = products;
