import type { Test } from '@lvce-editor/test-with-playwright'

interface NodeRelease {
  readonly version?: unknown
}

type TestApi = Parameters<Test>[0]

export const openNvmrcCompletion = async (
  { Command, Editor, FileSystem, Main, Workspace }: TestApi,
  releases: readonly NodeRelease[],
  text = '',
): Promise<void> => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Command.executeExtensionCommand('nvmrc.test.setNodeReleases', releases)
  await FileSystem.writeFile(`${tmpDir}/.nvmrc`, text)
  await Main.openUri(`${tmpDir}/.nvmrc`)
  await Editor.setCursor(0, text.length)
  await Editor.openCompletion()
}

export const expectCompletionItem = async (
  { Locator, expect }: TestApi,
  index: number,
  label: string,
): Promise<void> => {
  const completions = Locator('#Completions')
  await expect(completions).toBeVisible()
  const completionItems = completions.locator('.EditorCompletionItem')
  await expect(completionItems.nth(index)).toHaveText(label)
}

export const expectNoCompletionItem = async (
  { Locator, expect }: TestApi,
  label: string,
): Promise<void> => {
  const completionItems = Locator('.EditorCompletionItem')
  await expect(completionItems.filter({ hasText: label })).toHaveCount(0)
}

export const releases = [
  { version: 'v22.11.0' },
  { version: 'v22.10.0' },
  { version: 'v20.18.1' },
  { version: 'v18.20.5' },
  { version: 'v16.20.2' },
]

