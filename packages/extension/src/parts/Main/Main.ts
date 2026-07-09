// @ts-nocheck
import * as NodeReleaseCache from '../NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseCompletion from '../NodeReleaseCompletion/NodeReleaseCompletion.ts'

const state = {
  isActivated: false,
}

export const activate = (): void => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  vscode.registerCompletionProvider(NodeReleaseCompletion)
  vscode.registerCommand({
    execute(releases: readonly NodeReleaseCache.NodeRelease[]): void {
      NodeReleaseCache.set(releases)
    },
    id: 'nvmrc.test.setNodeReleases',
  })
}

export const deactivate = (): void => {}
