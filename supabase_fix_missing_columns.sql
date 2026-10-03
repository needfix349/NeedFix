-- NeedFix: complete database fix. Safe to run multiple times.
-- Supabase > SQL Editor > New query > paste all > Run.
-- Every risky step is wrapped so a single mismatch can never stop the whole script.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION pg_temp.try_exec(sql TEXT) RETURNS VOID AS $$
BEGIN
  EXECUTE sql;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped: % -> %', sql, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS
SELECT pg_temp.try_exec($q$ALTER TABLE public.users
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
  ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ$q$);

-- 2. CUSTOMERS
SELECT pg_temp.try_exec($q$ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS customer_id TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS ip_address TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
  ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ$q$);

SELECT pg_temp.try_exec('ALTER TABLE public.customers ALTER COLUMN id SET DEFAULT gen_random_uuid()');
SELECT pg_temp.try_exec('ALTER TABLE public.customers ALTER COLUMN mobile_number DROP NOT NULL');
SELECT pg_temp.try_exec('ALTER TABLE public.customers ALTER COLUMN name DROP NOT NULL');
SELECT pg_temp.try_exec('ALTER TABLE public.customers ALTER COLUMN pin DROP NOT NULL');
SELECT pg_temp.try_exec('CREATE UNIQUE INDEX IF NOT EXISTS customers_customer_id_key ON public.customers (customer_id)');

-- 3. TECHNICIANS
SELECT pg_temp.try_exec($q$ALTER TABLE public.technicians
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
  ADD COLUMN IF NOT EXISTS gps_lng DOUBLE PRECISION$q$);

SELECT pg_temp.try_exec('CREATE INDEX IF NOT EXISTS technicians_user_id_idx ON public.technicians (user_id)');

-- 4. PROFILES
SELECT pg_temp.try_exec($q$ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS mobile TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS has_agreed_notice BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notice_agreed_at TIMESTAMPTZ$q$);

-- 5. BLOCKED DEVICES: allow blocks with only a code/device (no installation UUID)
SELECT pg_temp.try_exec('ALTER TABLE public.blocked_devices ALTER COLUMN installation_id DROP NOT NULL');
SELECT pg_temp.try_exec('ALTER TABLE public.blocked_devices ALTER COLUMN id SET DEFAULT gen_random_uuid()');

-- 6. PASSWORD RESET REQUESTS
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id TEXT PRIMARY KEY,
  username TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW()
);
SELECT pg_temp.try_exec($q$ALTER TABLE public.password_reset_requests
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ DEFAULT NOW()$q$);
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reset_requests_all" ON public.password_reset_requests;
CREATE POLICY "reset_requests_all" ON public.password_reset_requests FOR ALL USING (true) WITH CHECK (true);

-- 7. Remove old CHECK constraints on status that reject 'blocked' / 'active' / 'pending_deletion'
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
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', r.relname, r.conname);
  END LOOP;
END $$;

-- 8. Refresh the API schema cache so new columns work immediately
NOTIFY pgrst, 'reload schema';
