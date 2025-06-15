
-- Add a 'deleted_at' column for soft deletion of invoices
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- (Optional but recommended) Create an index to speed up queries that exclude deleted invoices
CREATE INDEX IF NOT EXISTS invoices_deleted_at_idx ON public.invoices(deleted_at);
