import { publicEnv as runtimePublicEnv, getPublicEnv as runtimeGetPublicEnv } from './public.mjs'

export type PublicEnv = {
  siteUrl: string
  supabaseUrl: string
  supabaseAnonKey: string
  stripePublishableKey: string | null
}

export const publicEnv = runtimePublicEnv as PublicEnv
export const getPublicEnv = runtimeGetPublicEnv as () => PublicEnv
