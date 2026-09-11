import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://zisyzcdyvubspwzxhgqj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_2yFaWmNNTXRgl9wFqE50jA_QC-pAP9F';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim().startsWith('http') &&
    supabaseAnonKey.trim().length > 10
  );
};

// Initialize Supabase Client if credentials are provided, or create a safe preview fallback client
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : (createClient(
      'https://needfix-preview-placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_preview_testing',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    ) as SupabaseClient);

export const SUPABASE_BUCKETS = {
  KYC_DOCUMENTS: 'kyc-documents',
  AADHAAR_DOCUMENTS: 'aadhaar-documents',
  STORE_LOGOS: 'store-logos',
};
