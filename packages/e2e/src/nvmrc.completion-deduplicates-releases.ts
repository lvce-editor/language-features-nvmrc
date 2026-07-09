import type { Test } from '@lvce-editor/test-with-playwright'
import { expectCompletionItem, openNvmrcCompletion } from './_nvmrcCompletion.ts'

export const name = 'nvmrc.completion-deduplicates-releases'

export const test: Test = async ({ Locator, expect, ...api }) => {
  await openNvmrcCompletion({ Locator, expect, ...api }, [
    { version: 'v22.11.0' },
    { version: 'v22.11.0' },
    { version: 'v20.18.1' },
  ])

  await expectCompletionItem({ Locator, expect, ...api }, 0, 'v22.11.0')
  await expect(Locator('.EditorCompletionItem').filter({ hasText: 'v22.11.0' })).toHaveCount(1)
}

