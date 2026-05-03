import test from 'node:test'
import assert from 'node:assert/strict'

test('public env requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY', async () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'

  const mod = await import('../src/env/public.mjs')
  assert.equal(mod.publicEnv.supabaseUrl, 'http://localhost:54321')
  assert.equal(mod.publicEnv.supabaseAnonKey, 'anon')
})

test('server env getters throw when missing', async () => {
  delete process.env.STRIPE_SECRET_KEY

  const mod = await import('../src/env/server.mjs')
  assert.throws(() => mod.requireStripeSecretKey(), /Missing required environment variable: STRIPE_SECRET_KEY/)
})
