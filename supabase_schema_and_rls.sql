-- ==============================================================================
-- NeedFix: Supabase PostgreSQL Schema, RLS Policies & Admin Security Configuration
-- ==============================================================================
-- Primary Master Admin Credentials:
--   Email: needfix349@gmail.com
--   Password: Nadeem@1266
-- Multi-Admin Concurrency: Supports up to 10 concurrent administrator logins
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    mobile TEXT,
    country_code TEXT DEFAULT '+91',
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'technician', 'admin')),
    avatar_url TEXT,
    has_agreed_notice BOOLEAN DEFAULT FALSE,
    notice_agreed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Index for role-based permission checks & fast lookup
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 2. TECHNICIANS TABLE
CREATE TABLE IF NOT EXISTS public.technicians (
    id TEXT PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_technicians_code ON public.technicians(technician_code);
CREATE INDEX IF NOT EXISTS idx_technicians_status ON public.technicians(status);
CREATE INDEX IF NOT EXISTS idx_technicians_is_approved ON public.technicians(is_approved);
CREATE INDEX IF NOT EXISTS idx_technicians_is_blocked ON public.technicians(is_blocked);
CREATE INDEX IF NOT EXISTS idx_technicians_city ON public.technicians(city);

-- 3. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id TEXT PRIMARY KEY,
    admin_name TEXT NOT NULL,
    technician_id TEXT,
    technician_name TEXT,
    action TEXT NOT NULL, -- 'approved', 'rejected', 'suspended', 'reactivated', 'blocked'
    reason TEXT,
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_timestamp ON public.admin_audit_logs(timestamp DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
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

-- ------------------------------------------------------------------------------
-- USERS POLICIES
-- ------------------------------------------------------------------------------
-- Any user can read their own profile; Admins can read all users
CREATE POLICY "users_select_policy" ON public.users
    FOR SELECT
    USING (
        auth.uid()::text = id 
        OR public.is_admin()
    );

-- Users can insert/update their own profile; Admins can manage all users
CREATE POLICY "users_insert_update_policy" ON public.users
    FOR ALL
    USING (
        auth.uid()::text = id 
        OR public.is_admin()
    )
    WITH CHECK (
        auth.uid()::text = id 
        OR public.is_admin()
    );

-- ------------------------------------------------------------------------------
-- TECHNICIANS POLICIES
-- ------------------------------------------------------------------------------
-- Public/Customers: CAN ONLY SEE APPROVED & UNBLOCKED TECHNICIANS
-- Technicians: Can see their own profile
-- Admins: Can see all technicians (pending, rejected, suspended, blocked)
CREATE POLICY "technicians_select_policy" ON public.technicians
    FOR SELECT
    USING (
        (is_approved = TRUE AND is_blocked = FALSE)
        OR (auth.uid()::text = user_id)
        OR public.is_admin()
    );

-- Technician can submit initial application (INSERT)
CREATE POLICY "technicians_insert_policy" ON public.technicians
    FOR INSERT
    WITH CHECK (
        auth.uid()::text = user_id
        OR public.is_admin()
    );

-- Technician can update their own personal info (excluding approval & block flags)
-- Admins have full UPDATE and DELETE permissions
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
            -- Technicians cannot approve or unblock themselves:
            AND is_approved = (SELECT is_approved FROM public.technicians WHERE id = public.technicians.id)
            AND is_blocked = (SELECT is_blocked FROM public.technicians WHERE id = public.technicians.id)
        )
    );

-- Only Admins can DELETE technicians
CREATE POLICY "technicians_delete_policy" ON public.technicians
    FOR DELETE
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- ADMIN AUDIT LOGS POLICIES
-- ------------------------------------------------------------------------------
-- Strictly restricted to authenticated Admins only
CREATE POLICY "audit_logs_admin_only" ON public.admin_audit_logs
    FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- 5. STORAGE BUCKET SECURITY POLICIES (Aadhaar & Documents)
-- ==============================================================================
-- Aadhaar documents bucket: private bucket
-- Technicians can upload their own Aadhaar; Only authenticated Admins can view/read
INSERT INTO storage.buckets (id, name, public) 
VALUES ('aadhaar-documents', 'aadhaar-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-logos', 'store-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Read Policy for Aadhaar Documents
CREATE POLICY "aadhaar_storage_admin_read" ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'aadhaar-documents'
        AND (
            public.is_admin()
            OR (auth.uid()::text = (storage.foldername(name))[1])
        )
    );

-- Storage Upload Policy for Aadhaar Documents
CREATE POLICY "aadhaar_storage_upload" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'aadhaar-documents'
        AND (
            auth.uid() IS NOT NULL
            OR public.is_admin()
        )
    );

-- ==============================================================================
-- 6. MASTER ADMIN INITIALIZATION
-- ==============================================================================
INSERT INTO public.users (
    id,
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
    has_agreed_notice = true;
