import { expect, test } from '@jest/globals'
import * as NvmrcParser from '../src/parts/NvmrcParser/NvmrcParser.ts'

test('parse - version with comments and options', () => {
  expect(
    NvmrcParser.parse(`
# use the latest iron release
  v20.18.1 # Node.js version
mirror = https://example.com
`),
  ).toEqual({
    invalidEntries: [],
    versions: [
      {
        columnIndex: 2,
        endColumnIndex: 10,
        rowIndex: 2,
        value: 'v20.18.1',
      },
    ],
  })
})

test('parse - multiple versions', () => {
  expect(NvmrcParser.parse('v20.18.1\nv22.11.0')).toEqual({
    invalidEntries: [],
    versions: [
      {
        columnIndex: 0,
        endColumnIndex: 8,
        rowIndex: 0,
        value: 'v20.18.1',
      },
      {
        columnIndex: 0,
        endColumnIndex: 8,
        rowIndex: 1,
        value: 'v22.11.0',
      },
    ],
  })
})

test('parse - invalid options', () => {
  expect(
    NvmrcParser.parse('v20.18.1\nmirror=\nmirror=first\nmirror=second'),
  ).toEqual({
    invalidEntries: [
      {
        columnIndex: 0,
        endColumnIndex: 7,
        rowIndex: 1,
        value: 'mirror=',
      },
      {
        columnIndex: 0,
        endColumnIndex: 13,
        rowIndex: 3,
        value: 'mirror=second',
      },
    ],
    versions: [
      {
        columnIndex: 0,
        endColumnIndex: 8,
        rowIndex: 0,
        value: 'v20.18.1',
      },
    ],
  })
})
