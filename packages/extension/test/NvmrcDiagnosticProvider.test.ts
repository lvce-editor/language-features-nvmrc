// cspell:ignore iojs
import { afterEach, expect, test } from '@jest/globals'
import type { Diagnostic } from '@lvce-editor/api'
import * as NodeReleaseCache from '../src/parts/NodeReleaseCache/NodeReleaseCache.ts'
import * as NvmrcDiagnosticProvider from '../src/parts/NvmrcDiagnosticProvider/NvmrcDiagnosticProvider.ts'

const getDiagnostics = (text: string): Promise<readonly Diagnostic[]> => {
  return NvmrcDiagnosticProvider.provideDiagnostics({
    languageId: 'nvmrc',
    text,
    uri: 'memfs:///workspace/.nvmrc',
  })
}

afterEach(() => {
  NodeReleaseCache.clear()
})

test('provideDiagnostics - exact version', async () => {
  NodeReleaseCache.set([{ version: 'v22.11.0' }])

  await expect(getDiagnostics('v22.11.0')).resolves.toEqual([])
})

test('provideDiagnostics - partial version', async () => {
  NodeReleaseCache.set([{ version: 'v22.11.0' }])

  await expect(getDiagnostics('22')).resolves.toEqual([])
})

test('provideDiagnostics - version not found', async () => {
  NodeReleaseCache.set([{ version: 'v22.11.0' }])

  await expect(getDiagnostics('v99.0.0')).resolves.toEqual([
    {
      columnIndex: 0,
      endColumnIndex: 7,
      endRowIndex: 0,
      message: 'Node.js version not found: v99.0.0',
      rowIndex: 0,
      source: 'nvmrc',
      type: 'warning',
    },
  ])
})

test('provideDiagnostics - invalid version', async () => {
  await expect(getDiagnostics('v22..0')).resolves.toEqual([
    {
      columnIndex: 0,
      endColumnIndex: 6,
      endRowIndex: 0,
      message: 'Invalid Node.js version: v22..0',
      rowIndex: 0,
      source: 'nvmrc',
      type: 'warning',
    },
  ])
})

test('provideDiagnostics - known aliases', async () => {
  for (const alias of [
    'default',
    'iojs',
    'lts/*',
    'node',
    'stable',
    'system',
    'unstable',
  ]) {
    await expect(getDiagnostics(alias)).resolves.toEqual([])
  }
})

test('provideDiagnostics - LTS alias', async () => {
  NodeReleaseCache.set([
    {
      lts: 'Iron',
      version: 'v20.18.1',
    },
  ])

  await expect(getDiagnostics('lts/iron')).resolves.toEqual([])
  await expect(getDiagnostics('lts/unknown')).resolves.toEqual([
    {
      columnIndex: 0,
      endColumnIndex: 11,
      endRowIndex: 0,
      message: 'Node.js LTS alias not found: lts/unknown',
      rowIndex: 0,
      source: 'nvmrc',
      type: 'warning',
    },
  ])
})

test('provideDiagnostics - missing version', async () => {
  await expect(getDiagnostics('# comment\nmirror=example')).resolves.toEqual([
    {
      columnIndex: 0,
      endColumnIndex: 0,
      endRowIndex: 0,
      message: 'Expected exactly one Node.js version in .nvmrc.',
      rowIndex: 0,
      source: 'nvmrc',
      type: 'warning',
    },
  ])
})

test('provideDiagnostics - multiple versions', async () => {
  await expect(getDiagnostics('v20.18.1\nv22.11.0')).resolves.toEqual([
    {
      columnIndex: 0,
      endColumnIndex: 8,
      endRowIndex: 1,
      message: 'Invalid .nvmrc syntax. Expected exactly one Node.js version.',
      rowIndex: 1,
      source: 'nvmrc',
      type: 'warning',
    },
  ])
})
