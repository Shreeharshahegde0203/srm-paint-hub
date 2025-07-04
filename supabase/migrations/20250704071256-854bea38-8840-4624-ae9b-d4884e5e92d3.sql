-- Add partial_amount_paid column to invoices table to track partial payments
ALTER TABLE invoices ADD COLUMN partial_amount_paid DECIMAL DEFAULT 0;