import type { Test } from '@lvce-editor/test-with-playwright'
import {
  expectCompletionItem,
  openNvmrcCompletion,
} from './_nvmrcCompletion.js'

export const name = 'nvmrc.completion-patch-prefix'

export const test: Test = async (api) => {
  await openNvmrcCompletion(
    api,
    [{ version: 'v22.11.1' }, { version: 'v22.11.0' }],
    'v22.11.',
  )

  await expectCompletionItem(api, 0, 'v22.11.1')
  await expectCompletionItem(api, 1, 'v22.11.0')
}
