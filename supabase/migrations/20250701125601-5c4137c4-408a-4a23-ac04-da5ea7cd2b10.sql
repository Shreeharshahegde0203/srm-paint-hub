
-- Update products table to replace 'color' with 'base' and remove 'code'
ALTER TABLE public.products 
DROP COLUMN IF EXISTS code,
DROP COLUMN IF EXISTS color;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS base text;

-- Create unique constraint for product name + base combination
ALTER TABLE public.products 
DROP CONSTRAINT IF EXISTS unique_product_name_base;

ALTER TABLE public.products 
ADD CONSTRAINT unique_product_name_base 
UNIQUE (name, base);

-- Update unit column to support the new unit types
ALTER TABLE public.products 
ALTER COLUMN unit SET DEFAULT '1 Piece';

-- Add return items table to track returned items within invoices
CREATE TABLE IF NOT EXISTS public.invoice_returned_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  quantity numeric NOT NULL DEFAULT 0,
  unit_price numeric NOT NULL DEFAULT 0,
  return_reason text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for returned items
ALTER TABLE public.invoice_returned_items ENABLE ROW LEVEL SECURITY;

-- Create policies for returned items
CREATE POLICY "Allow all SELECT on returned items" 
  ON public.invoice_returned_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow insert/update/delete on returned items to authenticated" 
  ON public.invoice_returned_items 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Add color field to invoice_items for storing color name/code per item
ALTER TABLE public.invoice_items 
ADD COLUMN IF NOT EXISTS color_code text,
ADD COLUMN IF NOT EXISTS base text;
