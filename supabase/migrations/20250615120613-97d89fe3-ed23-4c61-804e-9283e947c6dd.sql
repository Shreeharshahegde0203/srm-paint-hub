
-- 1. Products table to store inventory items
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  color TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL,
  gst_rate INTEGER NOT NULL DEFAULT 18,
  unit TEXT NOT NULL DEFAULT 'Litre',
  image TEXT,
  batch_number TEXT,
  expiry_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Customers table for billing system
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Invoices table
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  total NUMERIC NOT NULL,
  created_by uuid, -- will link to user id after auth
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Invoice items table
CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- 5. (Optional) Profiles table for storing user info (to support proper auth)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security for all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simple open policies for initial setup (customize later for roles/auth)
CREATE POLICY "Allow all SELECT" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.invoice_items FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow insert/update/delete to authenticated" 
  ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert/update/delete to authenticated" 
  ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert/update/delete to authenticated" 
  ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert/update/delete to authenticated" 
  ON public.invoice_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert/update/delete to authenticated" 
  ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

