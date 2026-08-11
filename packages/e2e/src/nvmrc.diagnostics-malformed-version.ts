import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'nvmrc.diagnostics-malformed-version'

export const test: Test = async ({
  Editor,
  FileSystem,
  Main,
  Settings,
  Workspace,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Settings.update({ 'editor.diagnostics': true })
  await FileSystem.writeFile(`${tmpDir}/.nvmrc`, 'v24.19.')
  await Main.openUri(`${tmpDir}/.nvmrc`)
  await Editor.setCursor(0, 7)
  await Editor.type(' ')

  await Editor.shouldHaveDiagnostics([
    {
      columnIndex: 0,
      endColumnIndex: 7,
      endRowIndex: 0,
      message: 'Invalid Node.js version: v24.19.',
      rowIndex: 0,
      source: 'nvmrc',
      type: 'error',
    },
  ])
}
