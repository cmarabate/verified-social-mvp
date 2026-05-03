import {
  publicEnv as runtimePublicEnv,
  getPublicEnv as runtimeGetPublicEnv,
  requireSupabasePublicEnv as runtimeRequireSupabasePublicEnv,
} from './public.mjs'

export type PublicEnv = {
  siteUrl: string
  supabaseUrl: string | null
  supabaseAnonKey: string | null
  stripePublishableKey: string | null
}

export const publicEnv = runtimePublicEnv as PublicEnv
export const getPublicEnv = runtimeGetPublicEnv as () => PublicEnv
export const requireSupabasePublicEnv = runtimeRequireSupabasePublicEnv as () => {
  supabaseUrl: string
  supabaseAnonKey: string
}
