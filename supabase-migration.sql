-- SQL migration — run this in Supabase SQL Editor
--
-- IMPORTANT: Run this ENTIRE script in Supabase SQL Editor
-- after creating your project at supabase.com

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant schema usage to Supabase roles (required after DROP/CREATE SCHEMA public)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ===== TABLES FIRST =====

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL DEFAULT '',
  business_name TEXT NOT NULL,
  business_slug TEXT NOT NULL UNIQUE,
  whatsapp_number TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  plan_tier TEXT DEFAULT 'free'
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Add phone, password_hash, address columns if table already existed
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS password_hash TEXT NOT NULL DEFAULT '';
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS opening_hours TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS services TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS facebook TEXT;

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  media_url TEXT,
  source TEXT DEFAULT 'link',
  is_approved BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Session/business tokens for simple auth
CREATE TABLE IF NOT EXISTS business_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE business_tokens ENABLE ROW LEVEL SECURITY;

-- ===== INDEXES =====

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(business_slug);

-- ===== RLS POLICIES (after all tables exist) =====

-- RLS: businesses can only read/update their own data
CREATE POLICY "businesses_own"
  ON businesses
  FOR ALL
  USING (id = (SELECT business_id FROM business_tokens WHERE token = current_setting('app.token', TRUE)));

-- RLS: anyone can insert reviews
CREATE POLICY "reviews_insert"
  ON reviews
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS: public can read approved reviews
CREATE POLICY "reviews_select_approved"
  ON reviews
  FOR SELECT
  TO public
  USING (is_approved = true);

-- RLS: businesses manage their own reviews
CREATE POLICY "reviews_manage"
  ON reviews
  FOR ALL
  USING (business_id = (SELECT business_id FROM business_tokens WHERE token = current_setting('app.token', TRUE)));
