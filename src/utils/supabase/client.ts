import { createBrowserClient } from '@supabase/ssr'
import { requireSupabasePublicEnv } from '@/env/public'
import type { Database } from '@/types/database'

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = requireSupabasePublicEnv()
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
