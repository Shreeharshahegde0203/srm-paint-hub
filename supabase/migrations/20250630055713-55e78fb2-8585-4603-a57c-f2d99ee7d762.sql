
-- First, let's ensure we have all the necessary columns in regular_customers table
ALTER TABLE public.regular_customers 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS gstin TEXT;

-- Add project-wise product usage tracking
CREATE TABLE IF NOT EXISTS public.project_product_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES regular_customer_projects(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_used NUMERIC NOT NULL DEFAULT 0,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  used_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add project address and start_date to projects table
ALTER TABLE public.regular_customer_projects 
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update regular_customer_invoices to better track project billing
ALTER TABLE public.regular_customer_invoices 
ADD COLUMN IF NOT EXISTS gst_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS without_gst BOOLEAN DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_product_usage_project ON project_product_usage(project_id);
CREATE INDEX IF NOT EXISTS idx_project_product_usage_product ON project_product_usage(product_id);
CREATE INDEX IF NOT EXISTS idx_regular_customer_invoices_project ON regular_customer_invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_regular_customer_projects_customer ON regular_customer_projects(regular_customer_id);

-- Add billing mode to invoices for GST/Non-GST tracking
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS billing_mode TEXT DEFAULT 'with_gst' CHECK (billing_mode IN ('with_gst', 'without_gst')),
ADD COLUMN IF NOT EXISTS project_reference TEXT;
