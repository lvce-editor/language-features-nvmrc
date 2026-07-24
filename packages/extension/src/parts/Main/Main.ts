import {
  activate as activateExtensionApi,
  registerCommand,
  registerCompletionProvider,
  registerDiagnosticProvider,
} from '@lvce-editor/api'
import * as NodeReleaseCache from '../NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseCompletion from '../NodeReleaseCompletion/NodeReleaseCompletion.ts'
import * as NvmrcDiagnosticProvider from '../NvmrcDiagnosticProvider/NvmrcDiagnosticProvider.ts'

interface LegacyVscode {
  readonly registerCommand: (command: {
    readonly execute: (
      releases: readonly NodeReleaseCache.NodeRelease[],
    ) => void
    readonly id: string
  }) => void
  readonly registerCompletionProvider: (provider: unknown) => void
  readonly registerDiagnosticProvider?: (provider: unknown) => void
}

const state = {
  isActivated: false,
}

const getLegacyVscode = (): LegacyVscode | undefined => {
  const value = (globalThis as { readonly vscode?: unknown }).vscode
  if (!value || typeof value !== 'object') {
    return undefined
  }
  return value as LegacyVscode
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
  const legacyVscode = getLegacyVscode()
  if (legacyVscode) {
    legacyVscode.registerCompletionProvider(NodeReleaseCompletion)
    legacyVscode.registerDiagnosticProvider?.(NvmrcDiagnosticProvider)
    legacyVscode.registerCommand(command)
    return
  }
  await activateExtensionApi()
  registerCompletionProvider(NodeReleaseCompletion)
  registerDiagnosticProvider(NvmrcDiagnosticProvider)
  registerCommand(command)
}

export const deactivate = (): void => {}
