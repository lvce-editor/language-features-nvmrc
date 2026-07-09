import type { Test } from '@lvce-editor/test-with-playwright'
import { expectCompletionItem, openNvmrcCompletion } from './_nvmrcCompletion.ts'

export const name = 'nvmrc.completion-deduplicates-releases'

export const test: Test = async (api) => {
  await openNvmrcCompletion(api, [
    { version: 'v22.11.0' },
    { version: 'v22.11.0' },
    { version: 'v20.18.1' },
  ])

  await expectCompletionItem(api, 0, 'v22.11.0')
  await expect(api.Locator('.EditorCompletionItem', { hasText: 'v22.11.0' })).toHaveCount(1)
}
