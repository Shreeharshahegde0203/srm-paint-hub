
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
    code: 'SRM001',
    name: 'Royale Premium Emulsion',
    brand: 'Asian Paints',
    type: 'Emulsion',
    color: 'White',
    price: 1200,
    stock: 50,
    gstRate: 18,
    unit: 'Litre',
    description: 'Premium quality interior emulsion paint'
  },
  {
    id: '2',
    code: 'SRM002',
    name: 'WeatherCoat Advanced',
    brand: 'Berger',
    type: 'Exterior',
    color: 'Cream',
    price: 1500,
    stock: 30,
    gstRate: 18,
    unit: 'Litre',
    description: 'Weather resistant exterior paint'
  },
  {
    id: '3',
    code: 'SRM003',
    name: 'Velvet Touch Premium',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Blue',
    price: 1800,
    stock: 25,
    gstRate: 18,
    unit: 'Litre',
    description: 'Smooth finish premium emulsion'
  },
  {
    id: '4',
    code: 'SRM004',
    name: 'Excel Enamel Paint',
    brand: 'Nerolac',
    type: 'Enamel',
    color: 'Red',
    price: 900,
    stock: 40,
    gstRate: 18,
    unit: 'Litre',
    description: 'High gloss enamel paint'
  },
  {
    id: '5',
    code: 'SRM005',
    name: 'Majestic Oil Paint',
    brand: 'Jotun',
    type: 'Oil',
    color: 'Green',
    price: 2200,
    stock: 15,
    gstRate: 18,
    unit: 'Litre',
    description: 'Premium oil-based paint'
  },
  {
    id: '6',
    code: 'SRM006',
    name: 'Apex Ultima Protek',
    brand: 'Asian Paints',
    type: 'Exterior',
    color: 'Yellow',
    price: 1600,
    stock: 35,
    gstRate: 18,
    unit: 'Litre',
    description: 'Weather protection exterior paint'
  },
  {
    id: '7',
    code: 'SRM007',
    name: 'Easy Clean Luxury Emulsion',
    brand: 'Berger',
    type: 'Emulsion',
    color: 'Pink',
    price: 1400,
    stock: 28,
    gstRate: 18,
    unit: 'Litre',
    description: 'Easy to clean luxury emulsion'
  },
  {
    id: '8',
    code: 'SRM008',
    name: 'Promise Exterior Paint',
    brand: 'Dulux',
    type: 'Exterior',
    color: 'Grey',
    price: 1700,
    stock: 22,
    gstRate: 18,
    unit: 'Litre',
    description: 'Durable exterior paint coating'
  }
];
