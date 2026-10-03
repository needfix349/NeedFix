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

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_PATTERN.test(value);

// Columns that are native UUID type in the live database. Comparing them against
// non-UUID values (usernames, CUST-xxx codes) makes Postgres reject the WHOLE query
// with 22P02, so such comparisons are stripped before the request is sent.
const UUID_COLUMNS: Record<string, string[]> = {
  users: ['id', 'installation_id'],
  customers: ['id'],
  technicians: ['id'],
  blocked_devices: ['id', 'installation_id'],
  profiles: ['id'],
};

const sanitizeOrFilter = (orValue: string, uuidColumns: string[]): string => {
  const inner = orValue.replace(/^\(/, '').replace(/\)$/, '');
  const kept = inner.split(',').filter((term) => {
    const [column, operator, ...rest] = term.split('.');
    const value = rest.join('.');
    if (!uuidColumns.includes(column)) return true;
    if (operator !== 'eq' && operator !== 'neq') return true;
    return isUuid(value);
  });
  return kept.length > 0 ? `(${kept.join(',')})` : '(id.is.null)';
};

const uuidSafeFetch: typeof fetch = (input, init) => {
  try {
    const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(rawUrl);
    const tableMatch = url.pathname.match(/\/rest\/v1\/([a-z_]+)$/);
    const uuidColumns = tableMatch ? UUID_COLUMNS[tableMatch[1]] : undefined;
    if (uuidColumns) {
      let changed = false;
      const orValue = url.searchParams.get('or');
      if (orValue) {
        const safe = sanitizeOrFilter(orValue, uuidColumns);
        if (safe !== orValue) {
          url.searchParams.set('or', safe);
          changed = true;
        }
      }
      const idFilter = url.searchParams.get('id');
      if (idFilter?.startsWith('eq.') && !isUuid(idFilter.slice(3))) {
        url.searchParams.set('id', 'is.null');
        changed = true;
      }
      if (changed) {
        return fetch(typeof input === 'string' || input instanceof URL ? url.href : new Request(url.href, input), init);
      }
    }
  } catch {
    // Fall through to the unmodified request
  }
  return fetch(input, init);
};

// Initialize Supabase Client if credentials are provided, or create a safe preview fallback client
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: { fetch: uuidSafeFetch },
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
