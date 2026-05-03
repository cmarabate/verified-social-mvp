function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function optionalEnv(name) {
  const value = process.env[name]
  if (!value) return null
  return value
}

function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL
  if (value) return value
  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`
  return 'http://localhost:3000'
}

export function getPublicEnv() {
  return {
    siteUrl: getSiteUrl(),
    supabaseUrl: optionalEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: optionalEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    stripePublishableKey: optionalEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  }
}

export function requireSupabasePublicEnv() {
  return {
    supabaseUrl: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  }
}

export const publicEnv = getPublicEnv()
