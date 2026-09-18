-- ==============================================================================
-- NeedFix: Supabase PostgreSQL Schema, RLS Policies & Architecture Migrations
-- ==============================================================================
-- Primary Master Admin Credentials:
--   Email: needfix349@gmail.com
--   Password: Nadeem@1266
-- Multi-Admin Concurrency: Supports concurrent administrator logins
-- Native UUID v4 Primary Keys: Scalable to 1 Crore+ users without integer exhaustion
-- 1 User = 1 Permanent Account ID Policy (Unified Customer & Technician Profile)
-- ==============================================================================

-- Enable UUID & Cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE (Unified Identity & Account Policy)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT UNIQUE,
    account_identifier TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    mobile TEXT,
    country_code TEXT DEFAULT '+91',
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'technician', 'admin')),
    avatar_url TEXT,
    password_hash TEXT,
    security_question_1 TEXT,
    security_answer_1 TEXT,
    security_question_2 TEXT,
    security_answer_2 TEXT,
    security_pin_hash TEXT,
    search_radius_km NUMERIC DEFAULT 5,
    installation_id TEXT,
    created_ip TEXT,
    has_agreed_notice BOOLEAN DEFAULT FALSE,
    notice_agreed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Idempotent safe schema migrations for existing database
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_identifier TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS security_pin_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS search_radius_km NUMERIC DEFAULT 5;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS security_question_1 TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS security_answer_1 TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS security_question_2 TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS security_answer_2 TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS installation_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_ip TEXT;

-- Unique and fast search indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON public.users(username) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON public.users(LOWER(username)) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_account_id ON public.users(account_identifier) WHERE account_identifier IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON public.users(mobile);
CREATE INDEX IF NOT EXISTS idx_users_installation_id ON public.users(installation_id);

-- ------------------------------------------------------------------------------
-- 2. TECHNICIANS TABLE (1:1 Linked to user_id)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.technicians (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    technician_code TEXT UNIQUE, -- e.g. NF-TECH-1001
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    company_name TEXT,
    mobile TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    category_id TEXT NOT NULL,
    category_name TEXT NOT NULL,
    category_ids TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 1,
    coverage_radius_km INTEGER DEFAULT 15,
    inspection_fee NUMERIC DEFAULT 199,
    starting_price NUMERIC DEFAULT 299,
    aadhaar_url TEXT,
    aadhaar_number TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE, -- One-click Block / Blacklist
    blocked_at TIMESTAMPTZ,
    blocked_reason TEXT,
    is_online BOOLEAN DEFAULT FALSE,
    rating NUMERIC DEFAULT 5.0,
    rating_count INTEGER DEFAULT 0,
    city TEXT,
    address TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    rejection_reason TEXT,
    approved_at TIMESTAMPTZ,
    approved_by TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_technicians_user_id ON public.technicians(user_id);
CREATE INDEX IF NOT EXISTS idx_technicians_code ON public.technicians(technician_code);
CREATE INDEX IF NOT EXISTS idx_technicians_status ON public.technicians(status);
CREATE INDEX IF NOT EXISTS idx_technicians_is_approved ON public.technicians(is_approved);
CREATE INDEX IF NOT EXISTS idx_technicians_is_blocked ON public.technicians(is_blocked);
CREATE INDEX IF NOT EXISTS idx_technicians_city ON public.technicians(city);

-- ------------------------------------------------------------------------------
-- 3. BLOCKED DEVICES & UNIVERSAL BLACKLIST TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blocked_devices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    device_id TEXT NOT NULL,
    ip_address TEXT,
    unique_id TEXT,
    target_type TEXT NOT NULL CHECK (target_type IN ('customer', 'technician')),
    target_name TEXT NOT NULL,
    target_phone TEXT,
    reason TEXT NOT NULL,
    blocked_by TEXT NOT NULL,
    blocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_blocked_devices_device_id ON public.blocked_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_blocked_devices_ip ON public.blocked_devices(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_devices_unique_id ON public.blocked_devices(unique_id);

-- ------------------------------------------------------------------------------
-- 4. PASSWORD RESET REQUESTS TABLE (Admin Verification Backup)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT NOT NULL,
    registered_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
    temporary_password TEXT,
    admin_notes TEXT,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    requested_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_password_reset_status ON public.password_reset_requests(status);
CREATE INDEX IF NOT EXISTS idx_password_reset_username ON public.password_reset_requests(username);

-- ------------------------------------------------------------------------------
-- 5. ADMIN AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    admin_name TEXT NOT NULL,
    technician_id TEXT,
    technician_name TEXT,
    action TEXT NOT NULL, -- 'approved', 'rejected', 'suspended', 'reactivated', 'blocked'
    reason TEXT,
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_timestamp ON public.admin_audit_logs(timestamp DESC);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()::text
          AND role = 'admin'
    ) OR (
        auth.jwt() ->> 'email' = 'needfix349@gmail.com'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS POLICIES
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
CREATE POLICY "users_select_policy" ON public.users
    FOR SELECT
    USING (
        auth.uid()::text = id 
        OR public.is_admin()
        OR true -- Allows app to check username availability during registration
    );

DROP POLICY IF EXISTS "users_insert_update_policy" ON public.users;
CREATE POLICY "users_insert_update_policy" ON public.users
    FOR ALL
    USING (
        auth.uid()::text = id 
        OR public.is_admin()
        OR true -- Allows initial signup registration
    )
    WITH CHECK (
        auth.uid()::text = id 
        OR public.is_admin()
        OR true
    );

-- TECHNICIANS POLICIES
-- Public: CAN ONLY SEE APPROVED & UNBLOCKED TECHNICIANS
-- Technicians: Can see their own profile
-- Admins: Can see all technicians
DROP POLICY IF EXISTS "technicians_select_policy" ON public.technicians;
CREATE POLICY "technicians_select_policy" ON public.technicians
    FOR SELECT
    USING (
        (is_approved = TRUE AND is_blocked = FALSE)
        OR (auth.uid()::text = user_id)
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "technicians_insert_policy" ON public.technicians;
CREATE POLICY "technicians_insert_policy" ON public.technicians
    FOR INSERT
    WITH CHECK (
        auth.uid()::text = user_id
        OR public.is_admin()
        OR true -- Allows technician registration workflow
    );

DROP POLICY IF EXISTS "technicians_update_policy" ON public.technicians;
CREATE POLICY "technicians_update_policy" ON public.technicians
    FOR UPDATE
    USING (
        auth.uid()::text = user_id
        OR public.is_admin()
    )
    WITH CHECK (
        public.is_admin()
        OR (
            auth.uid()::text = user_id 
            AND is_approved = (SELECT is_approved FROM public.technicians WHERE id = public.technicians.id)
            AND is_blocked = (SELECT is_blocked FROM public.technicians WHERE id = public.technicians.id)
        )
    );

DROP POLICY IF EXISTS "technicians_delete_policy" ON public.technicians;
CREATE POLICY "technicians_delete_policy" ON public.technicians
    FOR DELETE
    USING (public.is_admin());

-- BLOCKED DEVICES POLICIES
-- Everyone can SELECT to check if their current device/IP is frozen
DROP POLICY IF EXISTS "blocked_devices_select_policy" ON public.blocked_devices;
CREATE POLICY "blocked_devices_select_policy" ON public.blocked_devices
    FOR SELECT
    USING (true);

-- Only Admins can INSERT, UPDATE, DELETE blocked devices
DROP POLICY IF EXISTS "blocked_devices_admin_policy" ON public.blocked_devices;
CREATE POLICY "blocked_devices_admin_policy" ON public.blocked_devices
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- PASSWORD RESET REQUESTS POLICIES
-- Anyone can submit a password reset request
DROP POLICY IF EXISTS "password_reset_insert_policy" ON public.password_reset_requests;
CREATE POLICY "password_reset_insert_policy" ON public.password_reset_requests
    FOR INSERT
    WITH CHECK (true);

-- Admins can view and resolve all requests
DROP POLICY IF EXISTS "password_reset_admin_policy" ON public.password_reset_requests;
CREATE POLICY "password_reset_admin_policy" ON public.password_reset_requests
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ADMIN AUDIT LOGS POLICIES
DROP POLICY IF EXISTS "audit_logs_admin_only" ON public.admin_audit_logs;
CREATE POLICY "audit_logs_admin_only" ON public.admin_audit_logs
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- 7. STORAGE BUCKET SECURITY POLICIES (Aadhaar & Store Logos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('aadhaar-documents', 'aadhaar-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-logos', 'store-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ==============================================================================
-- 8. MASTER ADMIN INITIALIZATION
-- ==============================================================================
INSERT INTO public.users (
    id,
    username,
    account_identifier,
    name,
    email,
    mobile,
    country_code,
    role,
    avatar_url,
    has_agreed_notice,
    created_at
) VALUES (
    'user_admin_master',
    'admin_nadeem',
    'NF-ADMIN-0001',
    'Nadeem (Master Admin)',
    'needfix349@gmail.com',
    '8092805945',
    '+91',
    'admin',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    true,
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    username = 'admin_nadeem',
    has_agreed_notice = true;
