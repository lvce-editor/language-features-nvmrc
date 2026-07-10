import {
  activate as activateExtensionApi,
  registerCommand,
  registerCompletionProvider,
} from '@lvce-editor/api'
import * as NodeReleaseCache from '../NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseCompletion from '../NodeReleaseCompletion/NodeReleaseCompletion.ts'

export const main = async (): Promise<void> => {
  await activateExtensionApi()
  registerCompletionProvider(NodeReleaseCompletion)
  registerCommand({
    execute(releases: readonly NodeReleaseCache.NodeRelease[]): void {
      NodeReleaseCache.set(releases)
    },
    id: 'nvmrc.test.setNodeReleases',
  })
}
