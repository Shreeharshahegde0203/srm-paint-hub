
-- 1. Add supplier table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  gst_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Enhance products with confidential receiving (cost) price, selling price, supplier reference, and reorder level
ALTER TABLE public.products
  ADD COLUMN cost_price NUMERIC,
  ADD COLUMN selling_price NUMERIC,
  ADD COLUMN supplier_id UUID REFERENCES public.suppliers(id),
  ADD COLUMN reorder_level INTEGER DEFAULT 10,
  ADD COLUMN last_received_date DATE;

-- 3. Inventory receipts (records each inventory receiving event)
CREATE TABLE public.inventory_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  quantity INTEGER NOT NULL,
  cost_price NUMERIC NOT NULL,
  receiving_date DATE NOT NULL,
  bill_due_date DATE,
  bill_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Attachments for inventory bills (support multiple file types)
CREATE TABLE public.bill_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID REFERENCES public.inventory_receipts(id) NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Stock movement log (in/out/adjustment)
CREATE TABLE public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) NOT NULL,
  movement_type TEXT NOT NULL, -- (in, out, adjust)
  quantity INTEGER NOT NULL,
  reason TEXT,
  related_receipt_id UUID REFERENCES public.inventory_receipts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Purchase orders table
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Link products to purchase orders (for when you order multiple products in a PO)
CREATE TABLE public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES public.purchase_orders(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  ordered_quantity INTEGER NOT NULL,
  cost_price NUMERIC
);

-- 8. Enable RLS for new tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

-- 9. Grant SELECT to all for now (customize policies later)
CREATE POLICY "Allow all SELECT" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.inventory_receipts FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.bill_attachments FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.inventory_movements FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.purchase_orders FOR SELECT USING (true);
CREATE POLICY "Allow all SELECT" ON public.purchase_order_items FOR SELECT USING (true);
