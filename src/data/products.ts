
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
  // Dulux Products (10 products)
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
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop',
    description: 'Premium silk finish emulsion with superior coverage and washable properties'
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
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=400&fit=crop',
    description: 'Advanced weather protection exterior paint with UV resistance and long-lasting finish'
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
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=400&fit=crop',
    description: 'Easy application interior emulsion paint with excellent coverage and smooth finish'
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
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400&h=400&fit=crop',
    description: 'High gloss synthetic enamel paint with superior durability and brilliant finish'
  },
  {
    id: '5',
    code: 'DLX005',
    name: 'Dulux EasyClean',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Mint Green',
    price: 1950,
    stock: 25,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=400&h=400&fit=crop',
    description: 'Stain resistant washable interior paint with anti-bacterial properties'
  },
  {
    id: '6',
    code: 'DLX006',
    name: 'Dulux Primer',
    brand: 'Dulux',
    type: 'Primer',
    color: 'White',
    price: 1200,
    stock: 42,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&h=400&fit=crop',
    description: 'High-quality wall primer for better paint adhesion and coverage'
  },
  {
    id: '7',
    code: 'DLX007',
    name: 'Dulux Weatherguard',
    brand: 'Dulux',
    type: 'Exterior',
    color: 'Terracotta',
    price: 2100,
    stock: 30,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&h=400&fit=crop',
    description: 'All-weather exterior paint with fade resistance and anti-algae protection'
  },
  {
    id: '8',
    code: 'DLX008',
    name: 'Dulux Apex',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Sunset Orange',
    price: 1750,
    stock: 35,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
    description: 'Premium interior emulsion with rich color depth and smooth texture'
  },
  {
    id: '9',
    code: 'DLX009',
    name: 'Dulux Metallic',
    brand: 'Dulux',
    type: 'Specialty',
    color: 'Silver',
    price: 2500,
    stock: 20,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?w=400&h=400&fit=crop',
    description: 'Premium metallic finish paint for decorative applications'
  },
  {
    id: '10',
    code: 'DLX010',
    name: 'Dulux Wood Stain',
    brand: 'Dulux',
    type: 'Wood Paint',
    color: 'Walnut',
    price: 1600,
    stock: 25,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=400&h=400&fit=crop',
    description: 'Protective wood stain with natural wood enhancement and preservation'
  },

  // Indigo Products (10 products)
  {
    id: '11',
    code: 'IND001',
    name: 'Indigo Royale',
    brand: 'Indigo',
    type: 'Emulsion',
    color: 'Cream',
    price: 1750,
    stock: 40,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=400&fit=crop',
    description: 'Luxurious matt finish interior paint with premium texture and coverage'
  },
  {
    id: '12',
    code: 'IND002',
    name: 'Indigo Shield Pro',
    brand: 'Indigo',
    type: 'Exterior',
    color: 'Sandstone',
    price: 2100,
    stock: 35,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=400&h=400&fit=crop',
    description: 'Ultimate exterior protection with UV resistance and weather-shield technology'
  },
  {
    id: '13',
    code: 'IND003',
    name: 'Indigo Acrylic Distemper',
    brand: 'Indigo',
    type: 'Distemper',
    color: 'Sunshine Yellow',
    price: 950,
    stock: 50,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=400&fit=crop',
    description: 'Premium acrylic distemper for smooth wall finish with vibrant colors'
  },
  {
    id: '14',
    code: 'IND004',
    name: 'Indigo Wood Finish',
    brand: 'Indigo',
    type: 'Wood Paint',
    color: 'Mahogany',
    price: 1800,
    stock: 20,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=400&h=400&fit=crop',
    description: 'Premium wood finish with natural look and superior protection'
  },
  {
    id: '15',
    code: 'IND005',
    name: 'Indigo Platinum',
    brand: 'Indigo',
    type: 'Emulsion',
    color: 'Lavender',
    price: 2000,
    stock: 30,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=400&fit=crop',
    description: 'Luxury interior emulsion with silk finish and superior washability'
  },
  {
    id: '16',
    code: 'IND006',
    name: 'Indigo Primer Sealer',
    brand: 'Indigo',
    type: 'Primer',
    color: 'White',
    price: 1100,
    stock: 45,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=400&h=400&fit=crop',
    description: 'Advanced primer sealer for superior paint adhesion and coverage'
  },
  {
    id: '17',
    code: 'IND007',
    name: 'Indigo Texture Paint',
    brand: 'Indigo',
    type: 'Specialty',
    color: 'Granite Grey',
    price: 2300,
    stock: 18,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=400&fit=crop',
    description: 'Decorative texture paint for creating artistic wall finishes'
  },
  {
    id: '18',
    code: 'IND008',
    name: 'Indigo Enamel',
    brand: 'Indigo',
    type: 'Enamel',
    color: 'Forest Green',
    price: 1550,
    stock: 25,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=400&fit=crop',
    description: 'High-gloss enamel paint with excellent durability and color retention'
  },
  {
    id: '19',
    code: 'IND009',
    name: 'Indigo Aqua Guard',
    brand: 'Indigo',
    type: 'Exterior',
    color: 'Ocean Blue',
    price: 2250,
    stock: 28,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?w=400&h=400&fit=crop',
    description: 'Waterproof exterior paint with anti-fungal and anti-algae properties'
  },
  {
    id: '20',
    code: 'IND010',
    name: 'Indigo Interior Plus',
    brand: 'Indigo',
    type: 'Emulsion',
    color: 'Rose Pink',
    price: 1650,
    stock: 33,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?w=400&h=400&fit=crop',
    description: 'Premium interior emulsion with stain-guard technology and easy maintenance'
  }
];
