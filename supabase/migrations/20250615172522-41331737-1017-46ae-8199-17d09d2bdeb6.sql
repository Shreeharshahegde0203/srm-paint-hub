
-- Disable Row Level Security on the regular_customers table so that inserts/updates/deletes work without RLS errors
ALTER TABLE public.regular_customers DISABLE ROW LEVEL SECURITY;

-- Optionally, disable RLS for the mapping table if you run into issues there as well:
-- ALTER TABLE public.regular_customer_products DISABLE ROW LEVEL SECURITY;
