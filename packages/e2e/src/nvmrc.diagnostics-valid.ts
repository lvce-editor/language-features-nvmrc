import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'nvmrc.diagnostics-valid'

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
  ])
  await FileSystem.writeFile(
    `${tmpDir}/.nvmrc`,
    '# use Node.js 22\n22 # partial versions are supported\nmirror=example',
  )
  await Main.openUri(`${tmpDir}/.nvmrc`)
  await Editor.setCursor(2, 14)
  await Editor.type(' ')

  await Editor.shouldHaveDiagnostics([])
}
