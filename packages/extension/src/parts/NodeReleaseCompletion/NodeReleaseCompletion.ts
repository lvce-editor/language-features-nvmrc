import * as NodeReleaseCache from '../NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseVersion from '../NodeReleaseVersion/NodeReleaseVersion.ts'

interface TextDocument {
  readonly languageId: string
  readonly text: string
  readonly uri: string
  readonly version: number
}

interface CompletionItem {
  readonly detail: string
  readonly insertText: string
  readonly label: string
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
    detail: 'Node.js version',
    insertText: version,
    label: version,
    sortText: `${String(index).padStart(6, '0')}-${version}`,
  }))
}
