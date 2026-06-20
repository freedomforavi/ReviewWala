import { createBrowserClient } from '@supabase/ssr'
import { createClient as createServerSupabase } from '@supabase/supabase-js'

// Browser client — for client components (uses anon key + RLS)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Server admin client — for API routes (bypasses RLS via service_role key)
export function createServiceClient() {
  return createServerSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
