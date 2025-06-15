
export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  type: string;
  color: string;
  price: number;
  stock: number;
  image?: string;
  gstRate: number;
  unit: string;
  batchNumber?: string;
  expiryDate?: string;
  description?: string;
}

export const productsDatabase: Product[] = [
  {
    id: '1',
    code: 'DLX001',
    name: 'Dulux Velvet Touch',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Pearl White',
    price: 1850,
    stock: 45,
    gstRate: 18,
    unit: 'Litre',
    description: 'Premium silk finish emulsion with superior coverage'
  },
  {
    id: '2',
    code: 'DLX002',
    name: 'Dulux WeatherShield Max',
    brand: 'Dulux',
    type: 'Exterior',
    color: 'Off White',
    price: 2200,
    stock: 32,
    gstRate: 18,
    unit: 'Litre',
    description: 'Advanced weather protection exterior paint'
  },
  {
    id: '3',
    code: 'DLX003',
    name: 'Dulux Promise Interior',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Sky Blue',
    price: 1650,
    stock: 38,
    gstRate: 18,
    unit: 'Litre',
    description: 'Easy application interior emulsion paint'
  },
  {
    id: '4',
    code: 'DLX004',
    name: 'Dulux Superlac',
    brand: 'Dulux',
    type: 'Enamel',
    color: 'Royal Blue',
    price: 1400,
    stock: 28,
    gstRate: 18,
    unit: 'Litre',
    description: 'High gloss synthetic enamel paint'
  },
  {
    id: '5',
    code: 'IND001',
    name: 'Indigo Royale',
    brand: 'Indigo',
    type: 'Emulsion',
    color: 'Cream',
    price: 1750,
    stock: 40,
    gstRate: 18,
    unit: 'Litre',
    description: 'Luxurious matt finish interior paint'
  },
  {
    id: '6',
    code: 'IND002',
    name: 'Indigo Shield Pro',
    brand: 'Indigo',
    type: 'Exterior',
    color: 'Sandstone',
    price: 2100,
    stock: 35,
    gstRate: 18,
    unit: 'Litre',
    description: 'Ultimate exterior protection with UV resistance'
  },
  {
    id: '7',
    code: 'DLX005',
    name: 'Dulux EasyClean',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Mint Green',
    price: 1950,
    stock: 25,
    gstRate: 18,
    unit: 'Litre',
    description: 'Stain resistant washable interior paint'
  },
  {
    id: '8',
    code: 'IND003',
    name: 'Indigo Acrylic Distemper',
    brand: 'Indigo',
    type: 'Distemper',
    color: 'Sunshine Yellow',
    price: 950,
    stock: 50,
    gstRate: 18,
    unit: 'Litre',
    description: 'Premium acrylic distemper for walls'
  },
  {
    id: '9',
    code: 'DLX006',
    name: 'Dulux Primer',
    brand: 'Dulux',
    type: 'Primer',
    color: 'White',
    price: 1200,
    stock: 42,
    gstRate: 18,
    unit: 'Litre',
    description: 'High-quality wall primer for better adhesion'
  },
  {
    id: '10',
    code: 'IND004',
    name: 'Indigo Wood Finish',
    brand: 'Indigo',
    type: 'Wood Paint',
    color: 'Mahogany',
    price: 1800,
    stock: 20,
    gstRate: 18,
    unit: 'Litre',
    description: 'Premium wood finish with natural look'
  }
];
