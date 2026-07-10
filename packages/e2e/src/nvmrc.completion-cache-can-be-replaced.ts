import type { Test } from '@lvce-editor/test-with-playwright'
import {
  expectCompletionItem,
  openNvmrcCompletion,
} from './_nvmrcCompletion.js'

export const name = 'nvmrc.completion-cache-can-be-replaced'

export const test: Test = async (api) => {
  await api.Command.execute(
    'ExtensionHost.executeCommand',
    'nvmrc.test.setNodeReleases',
    [{ version: 'v16.20.2' }],
  )
  await openNvmrcCompletion(api, [{ version: 'v22.11.0' }])
  await expectCompletionItem(api, 0, 'v22.11.0')
}
