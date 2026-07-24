import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'nvmrc.diagnostics-invalid-version'

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
  await FileSystem.writeFile(`${tmpDir}/.nvmrc`, 'v99.0.0')
  await Main.openUri(`${tmpDir}/.nvmrc`)

  await Editor.shouldHaveDiagnostics([
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
}
