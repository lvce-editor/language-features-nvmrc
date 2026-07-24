import { expect, test } from '@jest/globals'
import * as NodeReleaseVersion from '../src/parts/NodeReleaseVersion/NodeReleaseVersion.ts'

test('getVersions', () => {
  expect(
    NodeReleaseVersion.getVersions([
      { version: 'v22.11.0' },
      { version: 'v20.18.1' },
      { version: 'v22.11.0' },
      { version: 'nightly' },
      { version: 123 },
      {},
    ]),
  ).toEqual(['v22.11.0', 'v20.18.1'])
})

test('hasMatchingVersion', () => {
  const releases = [{ version: 'v22.11.0' }, { version: 'v20.18.1' }]

  expect(NodeReleaseVersion.hasMatchingVersion(releases, '22')).toBe(true)
  expect(NodeReleaseVersion.hasMatchingVersion(releases, 'v22.11')).toBe(true)
  expect(NodeReleaseVersion.hasMatchingVersion(releases, '22.11.0')).toBe(true)
  expect(NodeReleaseVersion.hasMatchingVersion(releases, '22.10')).toBe(false)
  expect(NodeReleaseVersion.hasMatchingVersion(releases, 'latest')).toBe(false)
})

test('hasLtsAlias', () => {
  const releases = [
    { lts: 'Iron', version: 'v20.18.1' },
    { lts: false, version: 'v22.11.0' },
  ]

  expect(NodeReleaseVersion.hasLtsAlias(releases, 'iron')).toBe(true)
  expect(NodeReleaseVersion.hasLtsAlias(releases, 'IRON')).toBe(true)
  expect(NodeReleaseVersion.hasLtsAlias(releases, 'hydrogen')).toBe(false)
})
