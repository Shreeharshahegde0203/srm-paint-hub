
import { supabase } from "@/integrations/supabase/client";
import { useGlobalCache } from "./useGlobalCache";
import { CACHE_CONFIGS } from "@/services/cacheService";

export interface ReferenceData {
  brands: string[];
  paintTypes: string[];
  colors: string[];
  units: string[];
  customerTypes: string[];
  paymentMethods: string[];
}

export function useReferenceData() {
  // Fetch all reference data in one go for better performance
  const { data, isLoading, error, invalidateCache } = useGlobalCache<ReferenceData>(
    [CACHE_CONFIGS.REFERENCE_DATA.key],
    async () => {
      // Fetch brands from products
      const { data: products } = await supabase
        .from("products")
        .select("brand")
        .not("brand", "is", null);

      // Fetch paint types from products  
      const { data: paintTypesData } = await supabase
        .from("products")
        .select("type")
        .not("type", "is", null);

      // Fetch colors from products
      const { data: colorsData } = await supabase
        .from("products")
        .select("color")
        .not("color", "is", null);

      // Extract unique values
      const brands = [...new Set([
        ...products?.map(p => p.brand).filter(Boolean) || [],
        "Dulux", "Indigo", "Asian Paints", "Berger", "Nerolac", "Kansai Nerolac"
      ])].sort();

      const paintTypes = [...new Set([
        ...paintTypesData?.map(p => p.type).filter(Boolean) || [],
        "Emulsion", "Enamel", "Primer", "Distemper", "Texture", "Wood Finish"
      ])].sort();

      const colors = [...new Set([
        ...colorsData?.map(p => p.color).filter(Boolean) || [],
        "White", "Off White", "Cream", "Beige", "Yellow", "Red", "Blue", "Green", "Black"
      ])].sort();

      const units = ["Litre", "Kg", "Piece", "Box", "Gallon", "Quart"];
      const customerTypes = ["Regular", "Dealer", "Contractor", "New"];
      const paymentMethods = ["Cash", "Card", "UPI", "Bank Transfer", "Cheque"];

      return {
        brands,
        paintTypes,
        colors,
        units,
        customerTypes,
        paymentMethods,
      };
    },
    {
      staleTime: CACHE_CONFIGS.REFERENCE_DATA.staleTime,
      gcTime: CACHE_CONFIGS.REFERENCE_DATA.gcTime,
    }
  );

  return {
    referenceData: data,
    isLoading,
    error,
    invalidateReferenceData: invalidateCache,
    // Individual arrays for easier access
    brands: data?.brands || [],
    paintTypes: data?.paintTypes || [],
    colors: data?.colors || [],
    units: data?.units || [],
    customerTypes: data?.customerTypes || [],
    paymentMethods: data?.paymentMethods || [],
  };
}

// Specific hook for brands with instant suggestions
export function useCachedBrands() {
  const { brands, isLoading } = useReferenceData();
  
  const getBrandSuggestions = (input: string) => {
    if (!input || !brands.length) return [];
    
    const query = input.toLowerCase();
    return brands
      .filter(brand => brand.toLowerCase().includes(query))
      .sort((a, b) => {
        // Prioritize exact matches and starts-with matches
        const aStarts = a.toLowerCase().startsWith(query);
        const bStarts = b.toLowerCase().startsWith(query);
        
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        return a.localeCompare(b);
      })
      .slice(0, 10); // Limit to 10 suggestions
  };

  return {
    brands,
    isLoading,
    getBrandSuggestions,
  };
}
