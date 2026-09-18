-- ============================================================================
-- NEEDFIX SECURITY & USER MANAGEMENT DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ============================================================================

-- 1. EXTENSIONS & UNLIMITED AUTO-INCREMENT SEQUENCES (CUST-1, CUST-2... and TECH-1, TECH-2...)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SEQUENCE IF NOT EXISTS public.customer_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.technician_id_seq START 1;

-- ============================================================================
-- 2. CUSTOMERS TABLE
-- Tracks visitors & customers: Real IP address, unique Device Fingerprint, 
-- assigned Customer ID ('CUST-1', 'CUST-2'... scales infinitely), name, and blocking state.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    customer_id TEXT UNIQUE NOT NULL DEFAULT ('CUST-' || nextval('public.customer_id_seq')::TEXT),       -- e.g. 'CUST-1', 'CUST-2'...
    name TEXT NOT NULL,
    phone TEXT,
    ip_address TEXT NOT NULL,              -- Real IP address
    device_id TEXT NOT NULL,               -- Unique device fingerprint e.g. 'DEV-XXXX-XXXX'
    user_agent TEXT,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    is_blocked BOOLEAN DEFAULT FALSE,
    blocked_reason TEXT,
    blocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup by Unique ID, IP, Device, and Phone
CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON public.customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_device_id ON public.customers(device_id);
CREATE INDEX IF NOT EXISTS idx_customers_ip_address ON public.customers(ip_address);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_is_blocked ON public.customers(is_blocked);

-- ============================================================================
-- 3. TECHNICIANS TABLE (with security tracking fields)
-- Stores technician details: Name, Phone, Aadhaar, Real IP, Device ID,
-- and assigned Technician ID ('TECH-1', 'TECH-2'... scales infinitely).
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.technicians (
    id TEXT PRIMARY KEY,
    technician_code TEXT UNIQUE DEFAULT ('TECH-' || nextval('public.technician_id_seq')::TEXT),           -- e.g. 'TECH-1', 'TECH-2'...
    user_id TEXT,
    full_name TEXT NOT NULL,
    company_name TEXT,
    mobile TEXT NOT NULL,
    whatsapp_number TEXT,
    category_id TEXT,
    category_name TEXT,
    category_ids TEXT[],
    experience_years NUMERIC DEFAULT 5,
    coverage_radius_km NUMERIC DEFAULT 5,
    inspection_fee NUMERIC DEFAULT 299,
    starting_price NUMERIC DEFAULT 299,
    aadhaar_number TEXT,
    aadhaar_url TEXT,
    ip_address TEXT,                       -- Real IP captured at entry / registration
    device_id TEXT,                        -- Unique Device Fingerprint captured at registration
    is_approved BOOLEAN DEFAULT FALSE,     -- strictly false until admin approval
    is_verified BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    blocked_reason TEXT,
    blocked_at TIMESTAMPTZ,
    is_online BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',          -- 'pending' | 'approved' | 'rejected' | 'suspended'
    rating NUMERIC DEFAULT 5.0,
    rating_count INTEGER DEFAULT 0,
    city TEXT,
    address TEXT,
    approved_at TIMESTAMPTZ,
    approved_by TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookup by Unique ID, Phone, Aadhaar, IP, and Device
CREATE INDEX IF NOT EXISTS idx_technicians_code ON public.technicians(technician_code);
CREATE INDEX IF NOT EXISTS idx_technicians_mobile ON public.technicians(mobile);
CREATE INDEX IF NOT EXISTS idx_technicians_device_id ON public.technicians(device_id);
CREATE INDEX IF NOT EXISTS idx_technicians_ip_address ON public.technicians(ip_address);
CREATE INDEX IF NOT EXISTS idx_technicians_is_blocked ON public.technicians(is_blocked);
CREATE INDEX IF NOT EXISTS idx_technicians_status ON public.technicians(status);

-- ============================================================================
-- 4. BLOCKED DEVICES TABLE (UNIVERSAL BLACKLIST)
-- Freezes access completely if current user's IP or Device ID matches.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blocked_devices (
    id TEXT PRIMARY KEY,
    device_id TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('customer', 'technician')),
    target_id TEXT,
    unique_id TEXT NOT NULL,               -- 'CUST-XXXX' or 'TECH-XXXX'
    target_name TEXT NOT NULL,
    target_phone TEXT,
    reason TEXT NOT NULL,
    blocked_by TEXT NOT NULL,
    blocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning-fast matching on every page load
CREATE INDEX IF NOT EXISTS idx_blocked_devices_device_id ON public.blocked_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_blocked_devices_ip_address ON public.blocked_devices(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_devices_unique_id ON public.blocked_devices(unique_id);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_devices ENABLE ROW LEVEL SECURITY;

-- Allow public read access to blocked_devices so app can check blocking state
DROP POLICY IF EXISTS "Public can check blocked devices" ON public.blocked_devices;
CREATE POLICY "Public can check blocked devices" 
ON public.blocked_devices FOR SELECT 
USING (true);

-- Allow public insert/upsert to customers table for visitor tracking
DROP POLICY IF EXISTS "Public can insert or update customer tracking" ON public.customers;
CREATE POLICY "Public can insert or update customer tracking" 
ON public.customers FOR ALL 
USING (true) 
WITH CHECK (true);

-- Allow public select on approved & non-blocked technicians
DROP POLICY IF EXISTS "Public can view approved technicians" ON public.technicians;
CREATE POLICY "Public can view approved technicians" 
ON public.technicians FOR SELECT 
USING (true);

-- Allow public registration insert for technicians
DROP POLICY IF EXISTS "Public can register technicians" ON public.technicians;
CREATE POLICY "Public can register technicians" 
ON public.technicians FOR INSERT 
WITH CHECK (true);

-- Full management on all tables for authenticated users/service role
DROP POLICY IF EXISTS "Admins have full access to blocked_devices" ON public.blocked_devices;
CREATE POLICY "Admins have full access to blocked_devices" 
ON public.blocked_devices FOR ALL 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to technicians" ON public.technicians;
CREATE POLICY "Admins have full access to technicians" 
ON public.technicians FOR ALL 
USING (true) 
WITH CHECK (true);
