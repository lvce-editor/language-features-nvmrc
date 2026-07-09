import type { Test } from '@lvce-editor/test-with-playwright'
import {
  expectCompletionItem,
  openNvmrcCompletion,
} from './_nvmrcCompletion.ts'

export const name = 'nvmrc.completion-keeps-node-api-order'

export const test: Test = async (api) => {
  await openNvmrcCompletion(api, [
    { version: 'v18.20.5' },
    { version: 'v22.11.0' },
    { version: 'v20.18.1' },
  ])

  await expectCompletionItem(api, 0, 'v18.20.5')
  await expectCompletionItem(api, 1, 'v22.11.0')
  await expectCompletionItem(api, 2, 'v20.18.1')
}
