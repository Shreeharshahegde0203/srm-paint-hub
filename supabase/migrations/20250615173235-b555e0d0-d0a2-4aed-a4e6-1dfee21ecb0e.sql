
-- 1. Paint Product Master Catalog Table
CREATE TABLE public.paint_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,        -- Unique Product Code
  name TEXT NOT NULL,               -- Product Name
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  default_price NUMERIC NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Inventory Table (Stock Management)
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code TEXT NOT NULL REFERENCES paint_products(code) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  last_restocked_date TIMESTAMP WITH TIME ZONE,
  min_stock_alert_threshold INTEGER DEFAULT 10,
  UNIQUE(product_code),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for future multi-user support (optional; not required if public for admin use)
-- ALTER TABLE public.paint_products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
