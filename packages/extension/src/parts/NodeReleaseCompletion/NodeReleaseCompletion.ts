import * as NodeReleaseCache from '../NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseVersion from '../NodeReleaseVersion/NodeReleaseVersion.ts'

interface TextDocument {
  readonly text: string
  readonly uri: string
  readonly languageId: string
  readonly version: number
}

interface CompletionItem {
  readonly label: string
  readonly insertText: string
  readonly detail: string
  readonly sortText: string
}

export const languageId = 'nvmrc'

export const triggerCharacters: readonly string[] = ['v', '.']

export const provideCompletions = async (
  _textDocument: TextDocument,
  _offset: number,
): Promise<readonly CompletionItem[]> => {
  const releases = await NodeReleaseCache.get()
  const versions = NodeReleaseVersion.getVersions(releases)
  return versions.map((version, index) => ({
    label: version,
    insertText: version,
    detail: 'Node.js version',
    sortText: `${String(index).padStart(6, '0')}-${version}`,
  }))
}

