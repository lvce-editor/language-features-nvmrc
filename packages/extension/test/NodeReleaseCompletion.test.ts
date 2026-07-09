import { afterEach, expect, test } from '@jest/globals'
import * as NodeReleaseCache from '../src/parts/NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseCompletion from '../src/parts/NodeReleaseCompletion/NodeReleaseCompletion.ts'

const textDocument = {
  languageId: 'nvmrc',
  text: '',
  uri: 'memfs:///workspace/.nvmrc',
  version: 1,
}

afterEach(() => {
  NodeReleaseCache.clear()
})

test('provideCompletions', async () => {
  NodeReleaseCache.set([{ version: 'v22.11.0' }, { version: 'v20.18.1' }])

  await expect(
    NodeReleaseCompletion.provideCompletions(textDocument, 0),
  ).resolves.toEqual([
    {
      detail: 'Node.js version',
      insertText: 'v22.11.0',
      label: 'v22.11.0',
      sortText: '000000-v22.11.0',
    },
    {
      detail: 'Node.js version',
      insertText: 'v20.18.1',
      label: 'v20.18.1',
      sortText: '000001-v20.18.1',
    },
  ])
})
