-- Fix the billing_mode check constraint to allow casual bills with any status
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_billing_mode_check;

-- Add updated constraint that allows casual bills with paid/pending status
ALTER TABLE invoices ADD CONSTRAINT invoices_billing_mode_check 
CHECK (
  billing_mode IN ('with_gst', 'without_gst', 'casual') OR
  (billing_mode = 'casual' AND status IN ('paid', 'pending'))
);