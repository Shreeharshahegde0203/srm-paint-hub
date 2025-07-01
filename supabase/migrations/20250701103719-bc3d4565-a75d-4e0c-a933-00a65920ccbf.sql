
-- Add HSN code to products table
ALTER TABLE products ADD COLUMN hsn_code TEXT;

-- Add billing_mode to invoices table to support different bill types
ALTER TABLE invoices ADD COLUMN bill_type TEXT DEFAULT 'gst' CHECK (bill_type IN ('gst', 'non_gst', 'casual'));

-- Update existing invoices to have default bill_type
UPDATE invoices SET bill_type = 'gst' WHERE bill_type IS NULL;
