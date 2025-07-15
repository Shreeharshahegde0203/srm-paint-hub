-- Update uniqueness constraint for products table
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS unique_product_name_base;
ALTER TABLE public.products ADD CONSTRAINT unique_product_name_base_unit UNIQUE (name, base, unit_quantity, unit_type); 