function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function requireSupabaseServiceRoleKey() {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY')
}

export function requireStripeSecretKey() {
  return requireEnv('STRIPE_SECRET_KEY')
}

export function requireStripeWebhookSecret() {
  return requireEnv('STRIPE_WEBHOOK_SECRET')
}
