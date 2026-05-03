import test from 'node:test'
import assert from 'node:assert/strict'

function importFresh(relativePath) {
  return import(new URL(`${relativePath}?t=${Date.now()}`, import.meta.url).href)
}

test('public env does not hard-crash when supabase env is missing', async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  delete process.env.NEXT_PUBLIC_SITE_URL

  const mod = await importFresh('../src/env/public.mjs')
  const env = mod.getPublicEnv()

  assert.equal(env.supabaseUrl, null)
  assert.equal(env.supabaseAnonKey, null)
  assert.equal(typeof env.siteUrl, 'string')
})

test('public env can require supabase config explicitly when needed', async () => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const mod = await importFresh('../src/env/public.mjs')
  assert.throws(
    () => mod.requireSupabasePublicEnv(),
    /Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL|Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY/
  )
})

test('server env getters throw when missing', async () => {
  delete process.env.STRIPE_SECRET_KEY

  const mod = await importFresh('../src/env/server.mjs')
  assert.throws(() => mod.requireStripeSecretKey(), /Missing required environment variable: STRIPE_SECRET_KEY/)
})
