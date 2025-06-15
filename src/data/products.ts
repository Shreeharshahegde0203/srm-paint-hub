
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
}

export const productsDatabase: Product[] = [
  {
    id: '1',
    code: 'AP001',
    name: 'Royale Premium Emulsion',
    brand: 'Asian Paints',
    type: 'Emulsion',
    color: 'White',
    price: 1200,
    stock: 50,
  },
  {
    id: '2',
    code: 'BP002',
    name: 'WeatherCoat Advanced',
    brand: 'Berger',
    type: 'Exterior',
    color: 'Cream',
    price: 1500,
    stock: 30,
  },
  {
    id: '3',
    code: 'DX003',
    name: 'Velvet Touch Premium',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Blue',
    price: 1800,
    stock: 25,
  },
  {
    id: '4',
    code: 'NR004',
    name: 'Excel Enamel Paint',
    brand: 'Nerolac',
    type: 'Enamel',
    color: 'Red',
    price: 900,
    stock: 40,
  },
  {
    id: '5',
    code: 'JT005',
    name: 'Majestic Oil Paint',
    brand: 'Jotun',
    type: 'Oil',
    color: 'Green',
    price: 2200,
    stock: 15,
  },
  {
    id: '6',
    code: 'AP006',
    name: 'Apex Ultima Protek',
    brand: 'Asian Paints',
    type: 'Exterior',
    color: 'Yellow',
    price: 1600,
    stock: 35,
  },
  {
    id: '7',
    code: 'BP007',
    name: 'Easy Clean Luxury Emulsion',
    brand: 'Berger',
    type: 'Emulsion',
    color: 'Pink',
    price: 1400,
    stock: 28,
  },
  {
    id: '8',
    code: 'DX008',
    name: 'Promise Exterior Paint',
    brand: 'Dulux',
    type: 'Exterior',
    color: 'Grey',
    price: 1700,
    stock: 22,
  }
];
