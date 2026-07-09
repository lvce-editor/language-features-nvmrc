interface NodeRelease {
  readonly version?: unknown
}

interface TestApi {
  readonly Command: any
  readonly Editor: any
  readonly FileSystem: any
  readonly Locator: any
  readonly Main: any
  readonly Workspace: any
  readonly expect: any
}

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
  const completionItems = Locator('.EditorCompletionItem', { hasText: label })
  await expect(completionItems).toHaveCount(0)
}

export const releases = [
  { version: 'v22.11.0' },
  { version: 'v22.10.0' },
  { version: 'v20.18.1' },
  { version: 'v18.20.5' },
  { version: 'v16.20.2' },
]
