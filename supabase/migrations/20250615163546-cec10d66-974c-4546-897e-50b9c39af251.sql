
-- 1. Create Regular Customers master table
CREATE TABLE public.regular_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- 2. Mapping table for regular_customer <-> product with custom price/rate
CREATE TABLE public.regular_customer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regular_customer_id UUID REFERENCES public.regular_customers(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  rate NUMERIC NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(regular_customer_id, product_id)
);
-- 3. RLS for both tables (open SELECT for now, can be tightened)
ALTER TABLE public.regular_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regular_customer_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON public.regular_customers FOR SELECT USING (true);
CREATE POLICY "Allow all" ON public.regular_customer_products FOR SELECT USING (true);
