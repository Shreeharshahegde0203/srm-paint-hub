-- Enable RLS on all unprotected tables and add security policies

-- Enable RLS on inventory table
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Enable RLS on paint_products table  
ALTER TABLE public.paint_products ENABLE ROW LEVEL SECURITY;

-- Enable RLS on project_product_usage table
ALTER TABLE public.project_product_usage ENABLE ROW LEVEL SECURITY;

-- Enable RLS on regular_customer_invoices table
ALTER TABLE public.regular_customer_invoices ENABLE ROW LEVEL SECURITY;

-- Enable RLS on regular_customer_payments table
ALTER TABLE public.regular_customer_payments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on regular_customer_projects table
ALTER TABLE public.regular_customer_projects ENABLE ROW LEVEL SECURITY;

-- Enable RLS on regular_customers table
ALTER TABLE public.regular_customers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on purchase_order_items table
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for inventory (authenticated users only)
CREATE POLICY "Allow authenticated users to view inventory" 
ON public.inventory FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to manage inventory" 
ON public.inventory FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for paint_products (authenticated users only)
CREATE POLICY "Allow authenticated users to view paint products" 
ON public.paint_products FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to manage paint products" 
ON public.paint_products FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for project_product_usage (authenticated users only)
CREATE POLICY "Allow authenticated users to view project usage" 
ON public.project_product_usage FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to manage project usage" 
ON public.project_product_usage FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for regular_customer_invoices (authenticated users only)
CREATE POLICY "Allow authenticated users to view customer invoices" 
ON public.regular_customer_invoices FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to manage customer invoices" 
ON public.regular_customer_invoices FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for regular_customer_payments (authenticated users only)
CREATE POLICY "Allow authenticated users to view customer payments" 
ON public.regular_customer_payments FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to manage customer payments" 
ON public.regular_customer_payments FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for regular_customer_projects (authenticated users only)
CREATE POLICY "Allow authenticated users to view customer projects" 
ON public.regular_customer_projects FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to manage customer projects" 
ON public.regular_customer_projects FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for regular_customers (authenticated users only)
CREATE POLICY "Allow authenticated users to view customers" 
ON public.regular_customers FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to manage customers" 
ON public.regular_customers FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create RLS policies for purchase_order_items (authenticated users only)
CREATE POLICY "Allow authenticated users to view purchase order items" 
ON public.purchase_order_items FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to manage purchase order items" 
ON public.purchase_order_items FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);