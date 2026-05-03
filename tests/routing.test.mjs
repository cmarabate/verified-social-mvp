import test from 'node:test'
import assert from 'node:assert/strict'

function importFresh(relativePath) {
  return import(new URL(`${relativePath}?t=${Date.now()}`, import.meta.url).href)
}

test('safeNextPath allows safe internal paths', async () => {
  const mod = await importFresh('../src/utils/routing.mjs')
  assert.equal(mod.safeNextPath('/account'), '/account')
  assert.equal(mod.safeNextPath('/profile?x=1'), '/profile?x=1')
})

test('safeNextPath rejects external, protocol-relative, or non-string values', async () => {
  const mod = await importFresh('../src/utils/routing.mjs')
  assert.equal(mod.safeNextPath('https://example.com'), null)
  assert.equal(mod.safeNextPath('//example.com'), null)
  assert.equal(mod.safeNextPath('account'), null)
  assert.equal(mod.safeNextPath(null), null)
})
