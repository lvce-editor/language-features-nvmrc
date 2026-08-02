import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('extension manifest uses the default icon', async () => {
  const manifestUrl = new URL('../../extension/extension.json', import.meta.url)
  const manifestText = await readFile(manifestUrl, 'utf8')
  const manifest = JSON.parse(manifestText)

  assert.equal('icon' in manifest, false)
})
