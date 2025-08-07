-- Add missing unit_quantity column to invoice_items table
ALTER TABLE public.invoice_items ADD COLUMN IF NOT EXISTS unit_quantity numeric;