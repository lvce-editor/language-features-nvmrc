import {
  activate as activateExtensionApi,
  registerCommand,
  registerCompletionProvider,
  registerDiagnosticProvider,
} from '@lvce-editor/api'
import * as NodeReleaseCache from '../NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseCompletion from '../NodeReleaseCompletion/NodeReleaseCompletion.ts'
import * as NvmrcDiagnosticProvider from '../NvmrcDiagnosticProvider/NvmrcDiagnosticProvider.ts'

const state = {
  isActivated: false,
}

export const activate = async (): Promise<void> => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  const command = {
    execute(releases: readonly NodeReleaseCache.NodeRelease[]): void {
      NodeReleaseCache.set(releases)
    },
    id: 'nvmrc.test.setNodeReleases',
  }
  await activateExtensionApi()
  registerCompletionProvider(NodeReleaseCompletion)
  registerDiagnosticProvider(NvmrcDiagnosticProvider)
  registerCommand(command)
}

export const deactivate = (): void => {}
