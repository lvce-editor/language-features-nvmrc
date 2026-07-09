import { afterEach, expect, jest, test } from '@jest/globals'
import * as NodeReleaseIndex from '../src/parts/NodeReleaseIndex/NodeReleaseIndex.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('fetchNodeReleaseIndex', async () => {
  const releases = [{ version: 'v22.11.0' }]
  jest
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async (): Promise<Response> => {
      return {
        json: async () => releases,
        ok: true,
      } as Response
    })

  await expect(NodeReleaseIndex.fetchNodeReleaseIndex()).resolves.toBe(releases)
})

test('fetchNodeReleaseIndex - http error', async () => {
  jest
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async (): Promise<Response> => {
      return {
        ok: false,
        status: 500,
      } as Response
    })

  await expect(NodeReleaseIndex.fetchNodeReleaseIndex()).rejects.toThrow(
    new Error('Failed to fetch Node.js versions: 500'),
  )
})

test('fetchNodeReleaseIndex - invalid response', async () => {
  jest
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async (): Promise<Response> => {
      return {
        json: async () => ({}),
        ok: true,
      } as Response
    })

  await expect(NodeReleaseIndex.fetchNodeReleaseIndex()).rejects.toThrow(
    new TypeError('Expected Node.js release index to be an array'),
  )
})
