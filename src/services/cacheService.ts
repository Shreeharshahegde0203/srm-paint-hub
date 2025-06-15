
export const CACHE_KEYS = {
  // Products and related
  PRODUCTS: 'products',
  BRANDS: 'brands',
  PAINT_TYPES: 'paint_types',
  COLORS: 'colors',
  
  // Customers and suppliers
  CUSTOMERS: 'customers',
  SUPPLIERS: 'suppliers',
  REGULAR_CUSTOMERS: 'regular_customers',
  
  // Reference data
  REFERENCE_DATA: 'reference_data',
  UNITS: 'units',
  
  // Invoices and payments
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
} as const;

export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,     // 2 minutes
  MEDIUM: 5 * 60 * 1000,    // 5 minutes
  LONG: 15 * 60 * 1000,     // 15 minutes
  REFERENCE: 30 * 60 * 1000, // 30 minutes for reference data
} as const;

export interface CacheConfig {
  key: string;
  ttl: number;
  staleTime?: number;
  gcTime?: number;
}

export const getCacheConfig = (key: keyof typeof CACHE_KEYS, customTTL?: number): CacheConfig => {
  const baseKey = CACHE_KEYS[key];
  const ttl = customTTL || CACHE_TTL.MEDIUM;
  
  return {
    key: baseKey,
    ttl,
    staleTime: ttl,
    gcTime: ttl * 2,
  };
};

// Predefined cache configurations for common data types
export const CACHE_CONFIGS = {
  PRODUCTS: getCacheConfig('PRODUCTS', CACHE_TTL.MEDIUM),
  BRANDS: getCacheConfig('BRANDS', CACHE_TTL.REFERENCE),
  SUPPLIERS: getCacheConfig('SUPPLIERS', CACHE_TTL.LONG),
  CUSTOMERS: getCacheConfig('CUSTOMERS', CACHE_TTL.MEDIUM),
  REFERENCE_DATA: getCacheConfig('REFERENCE_DATA', CACHE_TTL.REFERENCE),
} as const;
