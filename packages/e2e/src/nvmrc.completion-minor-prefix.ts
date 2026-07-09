import type { Test } from '@lvce-editor/test-with-playwright'
import {
  expectCompletionItem,
  openNvmrcCompletion,
  releases,
} from './_nvmrcCompletion.ts'

export const name = 'nvmrc.completion-minor-prefix'

export const test: Test = async (api) => {
  await openNvmrcCompletion(
    api,
    [{ version: 'v22.10.0' }, ...releases],
    'v22.10',
  )

  await expectCompletionItem(api, 0, 'v22.10.0')
}
