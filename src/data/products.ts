
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
  // Dulux Products (10 products) - Updated with authentic paint can images from official website
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
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-velvet-touch-pearl-glo/dulux-velvet-touch-pearl-glo-1.png',
    description: 'The exotic, silk-gloved feel of the Velvet Touch family of paints.'
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
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-weathershield-max/wmax_packshot.png',
    description: 'A revolutionary exterior paint that keeps your home looking beautiful for years.'
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
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-promise-interior/promise-in-packshot.png',
    description: 'A good quality, durable emulsion with a smooth finish and ChromaBrite technology.'
  },
  {
    id: '4',
    code: 'DLX004',
    name: 'Dulux Superlac Gloss',
    brand: 'Dulux',
    type: 'Enamel',
    color: 'Royal Blue',
    price: 1400,
    stock: 28,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-superlac-gloss/superlac-gloss-packshot.png',
    description: 'High gloss, durable enamel paint for wood and metal surfaces.'
  },
  {
    id: '5',
    code: 'DLX005',
    name: 'Dulux SuperClean',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Mint Green',
    price: 1950,
    stock: 25,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-superclean/superclean-packshot.png',
    description: 'A premium interior emulsion with superior stain resistance and washability.'
  },
  {
    id: '6',
    code: 'DLX006',
    name: 'Dulux Promise Primer',
    brand: 'Dulux',
    type: 'Primer',
    color: 'White',
    price: 1200,
    stock: 42,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-promise-primer/promise-primer-packshot.png',
    description: 'A high-quality water-based primer for interior and exterior surfaces.'
  },
  {
    id: '7',
    code: 'DLX007',
    name: 'Dulux WeatherShield Powerflexx',
    brand: 'Dulux',
    type: 'Exterior',
    color: 'Terracotta',
    price: 2100,
    stock: 30,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-weathershield-powerflexx/powerflexx-packshot.png',
    description: 'Advanced protection against cracks, fungus, and fading for exterior walls.'
  },
  {
    id: '8',
    code: 'DLX008',
    name: 'Dulux Ambiance',
    brand: 'Dulux',
    type: 'Emulsion',
    color: 'Sunset Orange',
    price: 1750,
    stock: 35,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-ambiance/new-ambiance-velvet-touch-packshot.png',
    description: 'A super premium interior paint that gives a rich, velvety finish to your walls.'
  },
  {
    id: '9',
    code: 'DLX009',
    name: 'Dulux Weathershield Flash',
    brand: 'Dulux',
    type: 'Specialty',
    color: 'Silver',
    price: 2500,
    stock: 20,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-weathershield-flash/flash-packshot.png',
    description: 'A premium, water-based paint for roofs that offers a beautiful sheen finish.'
  },
  {
    id: '10',
    code: 'DLX010',
    name: 'Dulux Aquatech',
    brand: 'Dulux',
    type: 'Wood Paint',
    color: 'Clear',
    price: 1600,
    stock: 25,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://www.dulux.in/content/dam/akzonobel-flourish/dulux/in/en/products/dulux-aquatech/aquatech-interior-packshot.png',
    description: 'A range of advanced waterproofing solutions for your home.'
  },

  // Indigo Products (10 products) - Updated with authentic paint can images from official website
  {
    id: '11',
    code: 'IND001',
    name: 'Indigo Luxury Interior Emulsion',
    brand: 'Indigo',
    type: 'Emulsion',
    color: 'Cream',
    price: 1750,
    stock: 40,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Luxury-Interior-Emulsion.png',
    description: 'A high-end emulsion that gives a rich, smooth finish to interior walls.'
  },
  {
    id: '12',
    code: 'IND002',
    name: 'Indigo Exterior Laminate',
    brand: 'Indigo',
    type: 'Exterior',
    color: 'Sandstone',
    price: 2100,
    stock: 35,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Exterior-Laminate.png',
    description: 'A premium exterior paint that provides excellent weather resistance and durability.'
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
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Acrylic-Distemper.png',
    description: 'An affordable and high-quality distemper for a smooth matte finish.'
  },
  {
    id: '14',
    code: 'IND004',
    name: 'Indigo PU Super Gloss Enamel',
    brand: 'Indigo',
    type: 'Wood Paint',
    color: 'Mahogany',
    price: 1800,
    stock: 20,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/PU-Super-Gloss-Enamel.png',
    description: 'A polyurethane-based enamel for a superior high-gloss finish on wood and metal.'
  },
  {
    id: '15',
    code: 'IND005',
    name: 'Indigo Platinum Series Paint',
    brand: 'Indigo',
    type: 'Emulsion',
    color: 'Lavender',
    price: 2000,
    stock: 30,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Platinum-Series-Paint.png',
    description: 'A premium interior paint with a bright, clean, and ultra-smooth finish.'
  },
  {
    id: '16',
    code: 'IND006',
    name: 'Indigo Exterior Wall Primer',
    brand: 'Indigo',
    type: 'Primer',
    color: 'White',
    price: 1100,
    stock: 45,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Exterior-Wall-Primer.png',
    description: 'A water-based primer that provides excellent adhesion for exterior topcoats.'
  },
  {
    id: '17',
    code: 'IND007',
    name: 'Indigo Fine-Tex Texture Paint',
    brand: 'Indigo',
    type: 'Specialty',
    color: 'Granite Grey',
    price: 2300,
    stock: 18,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Fine-Tex-Texture-Paint.png',
    description: 'A textured finish paint to create unique and beautiful patterns on walls.'
  },
  {
    id: '18',
    code: 'IND008',
    name: 'Indigo Super Gloss Enamel',
    brand: 'Indigo',
    type: 'Enamel',
    color: 'Forest Green',
    price: 1550,
    stock: 25,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Super-Gloss-Enamel.png',
    description: 'A high-gloss, solvent-based enamel for a durable and shiny finish.'
  },
  {
    id: '19',
    code: 'IND009',
    name: 'Indigo Polymer Putty',
    brand: 'Indigo',
    type: 'Putty',
    color: 'White',
    price: 900,
    stock: 60,
    gstRate: 18,
    unit: 'Kg',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Polymer-Putty.png',
    description: 'A white cement-based putty that provides a smooth base for painting.'
  },
  {
    id: '20',
    code: 'IND010',
    name: 'Indigo Interior Sheen Emulsion',
    brand: 'Indigo',
    type: 'Emulsion',
    color: 'Rose Pink',
    price: 1650,
    stock: 33,
    gstRate: 18,
    unit: 'Litre',
    image: 'https://indigopaints.com/wp-content/uploads/2023/11/Interior-Sheen-Emulsion.png',
    description: 'A premium interior emulsion that gives a soft sheen finish to walls.'
  }
];
