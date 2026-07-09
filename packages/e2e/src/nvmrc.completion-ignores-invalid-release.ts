import type { Test } from '@lvce-editor/test-with-playwright'
import { expectCompletionItem, expectNoCompletionItem, openNvmrcCompletion } from './_nvmrcCompletion.ts'

export const name = 'nvmrc.completion-ignores-invalid-release'

export const test: Test = async (api) => {
  await openNvmrcCompletion(api, [
    { version: 'nightly' },
    { version: 'v22' },
    { version: 'v22.11.0' },
    { version: 22 },
    {},
  ])

  await expectCompletionItem(api, 0, 'v22.11.0')
  await expectNoCompletionItem(api, 'nightly')
  await expectNoCompletionItem(api, 'v22')
}

