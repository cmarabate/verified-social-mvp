import test from 'node:test'
import assert from 'node:assert/strict'

test('safeNextPath allows internal paths', async () => {
  const mod = await import(new URL(`../src/utils/routing.mjs?t=${Date.now()}`, import.meta.url).href)
  assert.equal(mod.safeNextPath('/account'), '/account')
  assert.equal(mod.safeNextPath('/auth/login?next=%2Faccount'), '/auth/login?next=%2Faccount')
})

test('safeNextPath rejects external or malformed paths', async () => {
  const mod = await import(new URL(`../src/utils/routing.mjs?t=${Date.now()}`, import.meta.url).href)
  assert.equal(mod.safeNextPath('https://example.com'), null)
  assert.equal(mod.safeNextPath('//example.com'), null)
  assert.equal(mod.safeNextPath('account'), null)
  assert.equal(mod.safeNextPath(null), null)
})
