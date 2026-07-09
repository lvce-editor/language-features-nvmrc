import { afterEach, expect, test } from '@jest/globals'
import * as NodeReleaseCache from '../src/parts/NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseCompletion from '../src/parts/NodeReleaseCompletion/NodeReleaseCompletion.ts'

const textDocument = {
  text: '',
  uri: 'memfs:///workspace/.nvmrc',
  languageId: 'nvmrc',
  version: 1,
}

afterEach(() => {
  NodeReleaseCache.clear()
})

test('provideCompletions', async () => {
  NodeReleaseCache.set([{ version: 'v22.11.0' }, { version: 'v20.18.1' }])

  await expect(NodeReleaseCompletion.provideCompletions(textDocument, 0)).resolves.toEqual([
    {
      label: 'v22.11.0',
      insertText: 'v22.11.0',
      detail: 'Node.js version',
      sortText: '000000-v22.11.0',
    },
    {
      label: 'v20.18.1',
      insertText: 'v20.18.1',
      detail: 'Node.js version',
      sortText: '000001-v20.18.1',
    },
  ])
})

