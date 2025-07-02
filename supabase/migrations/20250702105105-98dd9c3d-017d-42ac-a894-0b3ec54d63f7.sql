
-- Add missing columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS unit_quantity numeric DEFAULT 1;

-- Update the products table to ensure we have all required fields
-- (hsn_code, base, unit, gst_rate, stock, image, description already exist)

-- Add customer_number column to customers table  
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS customer_number text,
ADD COLUMN IF NOT EXISTS gstin text;

-- Ensure invoice_items has all required fields for detailed billing
ALTER TABLE invoice_items
ADD COLUMN IF NOT EXISTS unit_type text DEFAULT 'Piece',
ADD COLUMN IF NOT EXISTS gst_percentage integer DEFAULT 18,
ADD COLUMN IF NOT EXISTS price_excluding_gst numeric;

-- Create index for better product search performance
CREATE INDEX IF NOT EXISTS idx_products_name_base ON products(name, base);
