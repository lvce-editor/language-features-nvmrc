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
