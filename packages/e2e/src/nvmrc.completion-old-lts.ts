import type { Test } from '@lvce-editor/test-with-playwright'
import { expectCompletionItem, openNvmrcCompletion } from './_nvmrcCompletion.ts'

export const name = 'nvmrc.completion-old-lts'

export const test: Test = async (api) => {
  await openNvmrcCompletion(api, [{ version: 'v18.20.5' }, { version: 'v16.20.2' }], 'v16')

  await expectCompletionItem(api, 0, 'v16.20.2')
}

