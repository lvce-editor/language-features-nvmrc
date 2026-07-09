import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'nvmrc.completion'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Command.executeExtensionCommand('nvmrc.test.setNodeReleases', [
    { version: 'v22.11.0' },
    { version: 'v20.18.1' },
  ])
  await FileSystem.writeFile(`${tmpDir}/.nvmrc`, `v`)
  await Main.openUri(`${tmpDir}/.nvmrc`)
  await Editor.setCursor(0, 1)

  // act
  await Editor.openCompletion()

  // assert
  const completions = Locator('#Completions')
  await expect(completions).toBeVisible()
  const completionItems = completions.locator('.EditorCompletionItem')
  await expect(completionItems.nth(0)).toHaveText('v22.11.0')
}

