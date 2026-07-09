import { afterEach, expect, test } from '@jest/globals'
import * as NodeReleaseIndex from '../src/parts/NodeReleaseIndex/NodeReleaseIndex.ts'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

test('fetchNodeReleaseIndex', async () => {
  const releases = [{ version: 'v22.11.0' }]
  globalThis.fetch = async () =>
    ({
      ok: true,
      json: async () => releases,
    }) as Response

  await expect(NodeReleaseIndex.fetchNodeReleaseIndex()).resolves.toBe(releases)
})

test('fetchNodeReleaseIndex - http error', async () => {
  globalThis.fetch = async () =>
    ({
      ok: false,
      status: 500,
    }) as Response

  await expect(NodeReleaseIndex.fetchNodeReleaseIndex()).rejects.toThrow(
    new Error('Failed to fetch Node.js versions: 500'),
  )
})

test('fetchNodeReleaseIndex - invalid response', async () => {
  globalThis.fetch = async () =>
    ({
      ok: true,
      json: async () => ({}),
    }) as Response

  await expect(NodeReleaseIndex.fetchNodeReleaseIndex()).rejects.toThrow(
    new TypeError('Expected Node.js release index to be an array'),
  )
})

