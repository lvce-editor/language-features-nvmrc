import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'nvmrc.diagnostics-invalid-syntax'

export const test: Test = async ({
  Command,
  Editor,
  FileSystem,
  Main,
  Settings,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Settings.update({ 'editor.diagnostics': true })
  await Command.executeExtensionCommand('nvmrc.test.setNodeReleases', [
    { version: 'v22.11.0' },
    { version: 'v20.18.1' },
  ])
  await FileSystem.writeFile(`${tmpDir}/.nvmrc`, 'v20.18.1\nv22.11.0')
  await Main.openUri(`${tmpDir}/.nvmrc`)
  await Editor.setCursor(1, 8)
  await Editor.type(' ')

  await Editor.shouldHaveDiagnostics([
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
}
