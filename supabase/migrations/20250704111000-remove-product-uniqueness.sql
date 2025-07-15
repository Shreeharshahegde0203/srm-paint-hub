-- Remove uniqueness constraint from products table
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS unique_product_name_base_unit; 