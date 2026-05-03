import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireSupabasePublicEnv } from '@/env/public'
import { requireSupabaseServiceRoleKey } from '@/env/server'
import type { Database } from '@/types/database'

export async function createAdminClient() {
  const cookieStore = await cookies()
  const { supabaseUrl } = requireSupabasePublicEnv()

  return createServerClient<Database>(
    supabaseUrl,
    requireSupabaseServiceRoleKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
