-- NeedFix: add columns the app uses but the live database is missing.
-- Safe to run multiple times (IF NOT EXISTS everywhere). Paste in Supabase > SQL Editor > Run.

-- 1. USERS
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS security_pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS search_radius_km INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS mobile TEXT,
  ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT '+91',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS has_agreed_notice BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notice_agreed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS account_identifier TEXT,
  ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
  ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ;

-- 2. CUSTOMERS
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS customer_id TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
  ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ;

ALTER TABLE public.customers ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.customers ALTER COLUMN mobile_number DROP NOT NULL;
ALTER TABLE public.customers ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.customers ALTER COLUMN pin DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS customers_customer_id_key ON public.customers (customer_id);

-- 3. TECHNICIANS
ALTER TABLE public.technicians
  ADD COLUMN IF NOT EXISTS user_id TEXT,
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS inspection_fee NUMERIC DEFAULT 299,
  ADD COLUMN IF NOT EXISTS starting_price NUMERIC DEFAULT 299,
  ADD COLUMN IF NOT EXISTS aadhaar_url TEXT,
  ADD COLUMN IF NOT EXISTS aadhaar_card_url TEXT,
  ADD COLUMN IF NOT EXISTS aadhaar_number TEXT,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
  ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 5.0,
  ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS area TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by TEXT,
  ADD COLUMN IF NOT EXISTS store_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS pincode TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS business_description TEXT,
  ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS services_offered JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS coverage_area_text TEXT,
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS installation_id TEXT,
  ADD COLUMN IF NOT EXISTS gps_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS gps_lng DOUBLE PRECISION;

CREATE INDEX IF NOT EXISTS technicians_user_id_idx ON public.technicians (user_id);

-- 4. PROFILES
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS mobile TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS has_agreed_notice BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notice_agreed_at TIMESTAMPTZ;

-- 5. BLOCKED DEVICES: allow blocks that only have a code/device (no installation UUID)
ALTER TABLE public.blocked_devices ALTER COLUMN installation_id DROP NOT NULL;
ALTER TABLE public.blocked_devices ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 6. PASSWORD RESET REQUESTS (table missing)
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reset_requests_all" ON public.password_reset_requests;
CREATE POLICY "reset_requests_all" ON public.password_reset_requests FOR ALL USING (true) WITH CHECK (true);

-- 7. Remove old CHECK constraints on status columns that reject 'blocked' / 'active' / 'pending_deletion'
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT con.conname, rel.relname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND con.contype = 'c'
      AND rel.relname IN ('users', 'customers', 'technicians')
      AND pg_get_constraintdef(con.oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', r.relname, r.conname);
  END LOOP;
END $$;

-- 8. Refresh the API schema cache so new columns work immediately
NOTIFY pgrst, 'reload schema';
