import type { Test } from '@lvce-editor/test-with-playwright'
import {
  expectCompletionItem,
  openNvmrcCompletion,
} from './_nvmrcCompletion.js'

export const name = 'nvmrc.completion-latest-lts'

export const test: Test = async (api) => {
  await openNvmrcCompletion(
    api,
    [{ version: 'v24.4.1' }, { version: 'v22.17.0' }],
    'v22',
  )

  await expectCompletionItem(api, 0, 'v22.17.0')
}
