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
  // Dulux Products (10 products) - Updated with authentic paint can images
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
    image: 'https://images.unsplash.com/photo-1562113530-57ba2cea77b2?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1606744888344-493238951221?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1606832045412-e8629309ad34?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1581783433449-de677645c730?w=400&h=400&fit=crop',
    description: 'Protective wood stain with natural wood enhancement and preservation'
  },

  // Indigo Products (10 products) - Updated with authentic paint can images
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
    image: 'https://images.unsplash.com/photo-1610557419874-f7e4e6b0d667?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1596227406193-ab8e550b02de?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1609705531581-70c0c4b33afd?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1595246140519-d5639d5b3a8f?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1609703466656-96a66e04ddff?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1609234656388-0ff363063d9d?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1609705531570-20bf4f76902d?w=400&h=400&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
    description: 'Premium interior emulsion with stain-guard technology and easy maintenance'
  }
];
