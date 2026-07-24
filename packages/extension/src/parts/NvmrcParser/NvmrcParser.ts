export interface NvmrcEntry {
  readonly columnIndex: number
  readonly endColumnIndex: number
  readonly rowIndex: number
  readonly value: string
}

export interface NvmrcParseResult {
  readonly invalidEntries: readonly NvmrcEntry[]
  readonly versions: readonly NvmrcEntry[]
}

const getEntry = (line: string, rowIndex: number): NvmrcEntry | undefined => {
  const commentIndex = line.indexOf('#')
  const content = commentIndex === -1 ? line : line.slice(0, commentIndex)
  const value = content.trim()
  if (!value) {
    return undefined
  }
  const columnIndex = content.indexOf(value)
  return {
    columnIndex,
    endColumnIndex: columnIndex + value.length,
    rowIndex,
    value,
  }
}

const isValidOption = (value: string): boolean => {
  const parts = value.split('=')
  return (
    parts.length === 2 &&
    parts[0].trim().length > 0 &&
    parts[1].trim().length > 0
  )
}

export const parse = (text: string): NvmrcParseResult => {
  const invalidEntries: NvmrcEntry[] = []
  const versions: NvmrcEntry[] = []
  const optionKeys = new Set<string>()
  const lines = text.split('\n')
  for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
    const entry = getEntry(lines[rowIndex], rowIndex)
    if (!entry) {
      continue
    }
    if (!entry.value.includes('=')) {
      versions.push(entry)
      continue
    }
    if (!isValidOption(entry.value)) {
      invalidEntries.push(entry)
      continue
    }
    const key = entry.value.slice(0, entry.value.indexOf('=')).trim()
    if (optionKeys.has(key)) {
      invalidEntries.push(entry)
      continue
    }
    optionKeys.add(key)
  }
  return {
    invalidEntries,
    versions,
  }
}
