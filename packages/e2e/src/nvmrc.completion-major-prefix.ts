import type { Test } from '@lvce-editor/test-with-playwright'
import {
  expectCompletionItem,
  openNvmrcCompletion,
  releases,
} from './_nvmrcCompletion.ts'

export const name = 'nvmrc.completion-major-prefix'

export const test: Test = async (api) => {
  await openNvmrcCompletion(api, [{ version: 'v20.18.1' }, ...releases], 'v20')

  await expectCompletionItem(api, 0, 'v20.18.1')
}
