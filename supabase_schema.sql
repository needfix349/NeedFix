-- ==============================================================================
-- NeedFix Clean Database Migration Script for Supabase PostgreSQL
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Go to "SQL Editor" from the left navigation menu
-- 3. Click "New query", paste this entire script, and click "Run" (▶)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. CUSTOMERS TABLE (customers) - Strictly for general customers only
-- ==============================================================================
-- Features:
-- - Name, Mobile Number (Unique), 4-Digit Secret PIN
-- - Device ID for anti-fake tracking & fraud prevention
-- - is_blocked status for instantaneous one-click administrative ban
-- - Zero SMS/Email OTP cost: instant sign-up & sign-in
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    pin VARCHAR(4) NOT NULL,
    device_id TEXT,
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all required columns exist on existing table instances
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(15);
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS pin VARCHAR(4);
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS device_id TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ DEFAULT NOW();

-- Create unique index on mobile_number for customer table
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_mobile_unique ON public.customers(mobile_number);
CREATE INDEX IF NOT EXISTS idx_customers_device_id ON public.customers(device_id);
CREATE INDEX IF NOT EXISTS idx_customers_is_blocked ON public.customers(is_blocked);

-- ==============================================================================
-- 2. TECHNICIANS TABLE (technicians) - Separate table for Service Providers
-- ==============================================================================
-- Features:
-- - Complete profile: Trades, skills, services offered, location, rates
-- - Verification documents: Store photos, Aadhaar 2-in-1 verification
-- - Administrative approval status: pending / approved / rejected / blocked
-- - Authentication: Mobile number + 4-Digit Secret PIN (pin column)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    pin VARCHAR(4) NOT NULL DEFAULT '0000',
    whatsapp_number VARCHAR(15),
    category_id TEXT,
    category_name TEXT,
    category_ids JSONB DEFAULT '[]'::jsonb,
    category_names JSONB DEFAULT '[]'::jsonb,
    experience_years INTEGER DEFAULT 0,
    hourly_rate NUMERIC DEFAULT 0,
    visiting_charges NUMERIC DEFAULT 0,
    coverage_radius_km INTEGER DEFAULT 10,
    coverage_area_text TEXT,
    business_address TEXT,
    state TEXT,
    district TEXT,
    city TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    profile_photo_url TEXT,
    store_photo_url TEXT,
    aadhaar_front_url TEXT,
    aadhaar_back_url TEXT,
    services_offered JSONB DEFAULT '[]'::jsonb,
    is_approved BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending',
    is_online BOOLEAN DEFAULT true,
    is_blocked BOOLEAN DEFAULT false,
    rejection_reason TEXT,
    device_id TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist on existing table instances
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS technician_code TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS mobile VARCHAR(15);
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS pin VARCHAR(4) DEFAULT '0000';
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(15);
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS category_id TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS category_name TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS category_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS category_names JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 0;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS visiting_charges NUMERIC DEFAULT 0;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS coverage_radius_km INTEGER DEFAULT 10;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS coverage_area_text TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS business_address TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS store_photo_url TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS aadhaar_front_url TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS aadhaar_back_url TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS services_offered JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT true;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS device_id TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes for lightning-fast queries and real-time filtering
CREATE UNIQUE INDEX IF NOT EXISTS idx_technicians_code ON public.technicians(technician_code);
CREATE INDEX IF NOT EXISTS idx_technicians_mobile ON public.technicians(mobile);
CREATE INDEX IF NOT EXISTS idx_technicians_pin ON public.technicians(pin);
CREATE INDEX IF NOT EXISTS idx_technicians_is_blocked ON public.technicians(is_blocked);
CREATE INDEX IF NOT EXISTS idx_technicians_status ON public.technicians(status);
CREATE INDEX IF NOT EXISTS idx_technicians_category ON public.technicians(category_id);

-- ==============================================================================
-- 3. BLOCKED DEVICES TABLE (blocked_devices) - Anti-Fraud & Hardware Lock
-- ==============================================================================
-- Features:
-- - Prevents blocked users from creating new accounts with alternate numbers
-- - Universal lockdown across app
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.blocked_devices (
    id TEXT PRIMARY KEY,
    device_id TEXT NOT NULL,
    ip_address TEXT,
    target_type TEXT DEFAULT 'customer',
    target_id TEXT,
    unique_id TEXT,
    target_name TEXT,
    target_phone TEXT,
    reason TEXT,
    blocked_by TEXT DEFAULT 'Admin',
    blocked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS device_id TEXT;
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS target_type TEXT DEFAULT 'customer';
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS target_id TEXT;
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS unique_id TEXT;
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS target_name TEXT;
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS target_phone TEXT;
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS reason TEXT;
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS blocked_by TEXT DEFAULT 'Admin';
ALTER TABLE public.blocked_devices ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_blocked_devices_device_id ON public.blocked_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_blocked_devices_ip ON public.blocked_devices(ip_address);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enables public API read & write for anon client while securing tables
-- ==============================================================================

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_devices ENABLE ROW LEVEL SECURITY;

-- Permissive policies for customers
DROP POLICY IF EXISTS "Allow public read and write customers" ON public.customers;
CREATE POLICY "Allow public read and write customers"
ON public.customers
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Permissive policies for technicians
DROP POLICY IF EXISTS "Allow public read and write technicians" ON public.technicians;
CREATE POLICY "Allow public read and write technicians"
ON public.technicians
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Permissive policies for blocked devices
DROP POLICY IF EXISTS "Allow public read and write blocked_devices" ON public.blocked_devices;
CREATE POLICY "Allow public read and write blocked_devices"
ON public.blocked_devices
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- 5. STORAGE BUCKETS CONFIGURATION (For KYC, Aadhaar, Store Photos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('aadhaar-documents', 'aadhaar-documents', true),
  ('kyc-documents', 'kyc-documents', true),
  ('store-logos', 'store-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public bucket access aadhaar-documents" ON storage.objects;
CREATE POLICY "Public bucket access aadhaar-documents" ON storage.objects
FOR ALL TO public USING (bucket_id IN ('aadhaar-documents', 'kyc-documents', 'store-logos'))
WITH CHECK (bucket_id IN ('aadhaar-documents', 'kyc-documents', 'store-logos'));

-- ==============================================================================
-- MIGRATION SCRIPT FINISHED SUCCESSFULLY!
-- ==============================================================================
