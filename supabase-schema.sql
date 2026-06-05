-- Run this SQL in your Supabase SQL Editor to create the tables

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  color TEXT,
  sizes TEXT[] NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  image TEXT,
  "isNewArrival" BOOLEAN DEFAULT false,
  "isPopular" BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 0,
  "originalPrice" INTEGER,
  -- Product type & status
  "productType" TEXT DEFAULT 'simple',
  status TEXT DEFAULT 'active',
  -- SEO fields
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "seoSlug" TEXT,
  -- Physical properties
  weight INTEGER,
  material TEXT,
  -- Digital product
  "digitalFileUrl" TEXT,
  -- Subscription product
  "subscriptionInterval" TEXT,
  "subscriptionPrice" INTEGER,
  -- Variable product variants (stored as JSONB array)
  variants JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If products table already exists, run these ALTER statements to add new columns:
ALTER TABLE products ADD COLUMN IF NOT EXISTS "productType" TEXT DEFAULT 'simple';
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE products ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "seoSlug" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS material TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "digitalFileUrl" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "subscriptionInterval" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "subscriptionPrice" INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';
-- (sku and originalPrice already exist — keep as-is)
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;


-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  items JSONB NOT NULL,
  total INTEGER NOT NULL,
  coupon_code TEXT,
  discount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value INTEGER NOT NULL,
  min_order INTEGER DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for products)
CREATE POLICY "Allow public read access on products" ON products
  FOR SELECT USING (true);

-- Create policies for public write access (for demo purposes)
CREATE POLICY "Allow public insert on products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on products" ON products
  FOR DELETE USING (true);

-- Orders policies
CREATE POLICY "Allow public insert on orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow public update on orders" ON orders
  FOR UPDATE USING (true);

-- Coupons policies
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on coupons" ON coupons
  FOR SELECT USING (true);
CREATE POLICY "Allow public update on coupons" ON coupons
  FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on coupons" ON coupons
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on coupons" ON coupons
  FOR DELETE USING (true);

-- Orders: add coupon fields (run if table already exists)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0;

-- Insert initial products data
INSERT INTO products (id, name, description, price, category, color, sizes, rating, reviews, image, "isNewArrival", "isPopular", stock, "originalPrice") VALUES
('1', 'Oversized ''Sabr'' Typography Tee', 'Trending drop-shoulder oversized fit featuring minimalist ''Sabr'' (Patience) Urdu typography. Premium heavy-weight cotton blend.', 1850, 'Unisex', 'Black', ARRAY['S', 'M', 'L', 'XL'], 4.9, 342, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800', true, true, 5, 2500),
('2', 'Anime Aesthetic Back-Print', 'High-density anime graphic on the back with a minimal chest hit. Streetwear essential for the modern wardrobe.', 2200, 'Men', 'White', ARRAY['M', 'L', 'XL'], 4.7, 128, 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=800', true, true, 12, 2800),
('3', 'Earth Tone Boxy Crop', 'A chic, boxy crop tee in trending olive green. Perfect for high-waisted denim or cargo pants.', 1450, 'Women', 'Olive', ARRAY['S', 'M', 'L'], 4.8, 210, 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=800', false, true, 3, 1800),
('4', 'Classic Essential Gym Fit', 'Muscle-fit tee crafted from moisture-wicking stretch fabric. Engineered for performance and aesthetics.', 1600, 'Men', 'Charcoal', ARRAY['S', 'M', 'L', 'XL'], 4.5, 89, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800', false, false, 25, 2000),
('5', 'Vintage Wash Acid Tee', 'Retro faded look achieved through an authentic acid wash process. No two shirts are exactly the same.', 2600, 'Unisex', 'Grey', ARRAY['M', 'L', 'XL'], 4.6, 156, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800', true, true, 8, 3200),
('6', 'Minimalist ''Lahore'' Coordinates', 'Show your city pride with subtle coordinate embroidery on the chest. Soft, everyday breathable cotton.', 1750, 'Unisex', 'Navy', ARRAY['S', 'M', 'L'], 4.9, 412, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', false, true, 14, 2200),
('7', 'Pastel Ribbed Baby Tee', 'Y2K inspired ribbed baby tee in soft lilac. Stretchy, comfortable, and highly trending.', 1200, 'Women', 'Lilac', ARRAY['S', 'M'], 4.7, 88, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800', true, false, 10, 1500),
('8', 'Cyberpunk Techwear Shirt', 'Avant-garde techwear design featuring tactical paneling and matte black finish. Water-resistant elements.', 3500, 'Men', 'Black', ARRAY['M', 'L', 'XL'], 4.8, 64, 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&q=80&w=800', true, true, 4, 4500);
