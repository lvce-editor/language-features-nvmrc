// cspell:ignore iojs
import type { Diagnostic } from '@lvce-editor/api'
import type { NvmrcEntry } from '../NvmrcParser/NvmrcParser.ts'
import * as NodeReleaseCache from '../NodeReleaseCache/NodeReleaseCache.ts'
import * as NodeReleaseVersion from '../NodeReleaseVersion/NodeReleaseVersion.ts'
import * as NvmrcParser from '../NvmrcParser/NvmrcParser.ts'

interface TextDocument {
  readonly languageId: string
  readonly text: string
  readonly uri: string
}

const numericVersionRegex =
  /^v?(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:\.(0|[1-9]\d*))?$/
const ltsAliasRegex = /^lts\/(\*|[a-z\d][a-z\d-]*)$/i
const knownAliases = new Set([
  'default',
  'iojs',
  'node',
  'stable',
  'system',
  'unstable',
])

export const id = 'nvmrc.provideDiagnostics'

export const languageId = 'nvmrc'

const toDiagnostic = (entry: NvmrcEntry, message: string): Diagnostic => {
  return {
    columnIndex: entry.columnIndex,
    endColumnIndex: entry.endColumnIndex,
    endRowIndex: entry.rowIndex,
    message,
    rowIndex: entry.rowIndex,
    source: 'nvmrc',
    type: 'warning',
  }
}

const getMissingVersionDiagnostic = (): Diagnostic => {
  return {
    columnIndex: 0,
    endColumnIndex: 0,
    endRowIndex: 0,
    message: 'Expected exactly one Node.js version in .nvmrc.',
    rowIndex: 0,
    source: 'nvmrc',
    type: 'warning',
  }
}

const getSyntaxDiagnostics = (
  text: string,
): {
  readonly diagnostics: readonly Diagnostic[]
  readonly version?: NvmrcEntry
} => {
  const result = NvmrcParser.parse(text)
  const diagnostics = result.invalidEntries.map((entry) =>
    toDiagnostic(
      entry,
      'Invalid .nvmrc syntax. Expected one key=value pair per line.',
    ),
  )
  if (result.versions.length === 0) {
    return {
      diagnostics: [...diagnostics, getMissingVersionDiagnostic()],
    }
  }
  if (result.versions.length > 1) {
    return {
      diagnostics: [
        ...diagnostics,
        ...result.versions
          .slice(1)
          .map((entry) =>
            toDiagnostic(
              entry,
              'Invalid .nvmrc syntax. Expected exactly one Node.js version.',
            ),
          ),
      ],
    }
  }
  if (diagnostics.length > 0) {
    return {
      diagnostics,
    }
  }
  return {
    diagnostics: [],
    version: result.versions[0],
  }
}

const getVersionDiagnostic = async (
  entry: NvmrcEntry,
): Promise<Diagnostic | undefined> => {
  const normalizedValue = entry.value.toLowerCase()
  if (knownAliases.has(normalizedValue)) {
    return undefined
  }
  const ltsMatch = ltsAliasRegex.exec(entry.value)
  if (ltsMatch) {
    if (ltsMatch[1] === '*') {
      return undefined
    }
    const releases = await NodeReleaseCache.get()
    if (NodeReleaseVersion.hasLtsAlias(releases, ltsMatch[1])) {
      return undefined
    }
    return toDiagnostic(entry, `Node.js LTS alias not found: ${entry.value}`)
  }
  if (!numericVersionRegex.test(entry.value)) {
    return toDiagnostic(entry, `Invalid Node.js version: ${entry.value}`)
  }
  const releases = await NodeReleaseCache.get()
  if (NodeReleaseVersion.hasMatchingVersion(releases, entry.value)) {
    return undefined
  }
  return toDiagnostic(entry, `Node.js version not found: ${entry.value}`)
}

export const provideDiagnostics = async (
  textDocument: TextDocument,
): Promise<readonly Diagnostic[]> => {
  const { diagnostics, version } = getSyntaxDiagnostics(textDocument.text)
  if (!version) {
    return diagnostics
  }
  const versionDiagnostic = await getVersionDiagnostic(version)
  return versionDiagnostic ? [versionDiagnostic] : []
}
