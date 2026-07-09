import type { Test } from '@lvce-editor/test-with-playwright'
import { expectCompletionItem, openNvmrcCompletion, releases } from './_nvmrcCompletion.ts'

export const name = 'nvmrc.completion-empty-file'

export const test: Test = async (api) => {
  await openNvmrcCompletion(api, releases)

  await expectCompletionItem(api, 0, 'v22.11.0')
  await expectCompletionItem(api, 1, 'v22.10.0')
}

