
-- Add "status" column to the invoices table
ALTER TABLE invoices
ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- (Optional for stricter data) Add a CHECK constraint
ALTER TABLE invoices
ADD CONSTRAINT invoices_status_check 
CHECK (status IN ('paid', 'pending', 'overdue'));
