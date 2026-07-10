// cspell:ignore nvmrc
import type { Test } from '@lvce-editor/test-with-playwright'
import {
  expectCompletionItem,
  openNvmrcCompletion,
} from './_nvmrcCompletion.js'

export const name = 'nvmrc.completion-ignores-invalid-release'

export const test: Test = async (api) => {
  await openNvmrcCompletion(api, [
    { version: 'nightly' },
    { version: 'v22' },
    { version: 'v22.11.0' },
    { version: 22 },
    {},
    { version: 'v20.18.1' },
  ])

  await expectCompletionItem(api, 0, 'v22.11.0')
  await expectCompletionItem(api, 1, 'v20.18.1')
}
