
-- 2. PROJECTS: each customer can have many projects
CREATE TABLE public.regular_customer_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regular_customer_id uuid NOT NULL REFERENCES regular_customers(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress', -- in_progress, completed
  estimated_quantity NUMERIC,
  completion_date DATE,
  site_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. INVOICES: link regular customer and project to invoices
CREATE TABLE public.regular_customer_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regular_customer_id uuid NOT NULL REFERENCES regular_customers(id) ON DELETE CASCADE,
  project_id uuid REFERENCES regular_customer_projects(id) ON DELETE SET NULL,
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. PAYMENTS: track payments & dues for regular customers
CREATE TABLE public.regular_customer_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regular_customer_id uuid NOT NULL REFERENCES regular_customers(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  paid_amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Add indexes for fast lookups
CREATE INDEX ON public.regular_customer_projects (regular_customer_id);
CREATE INDEX ON public.regular_customer_invoices (regular_customer_id);
CREATE INDEX ON public.regular_customer_payments (regular_customer_id);

-- 6. Add customer_type column to existing regular_customers table
ALTER TABLE public.regular_customers 
ADD COLUMN IF NOT EXISTS customer_type TEXT NOT NULL DEFAULT 'Regular';
