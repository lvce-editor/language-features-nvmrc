interface NodeRelease {
  readonly version?: unknown
}

interface TestApi {
  readonly Command: any
  readonly Editor: any
  readonly expect: any
  readonly FileSystem: any
  readonly Locator: any
  readonly Main: any
  readonly Workspace: any
}

export const openNvmrcCompletion = async (
  { Command, Editor, FileSystem, Main, Workspace }: TestApi,
  releases: readonly NodeRelease[],
  text = '',
): Promise<void> => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Command.execute(
    'ExtensionHost.executeCommand',
    'nvmrc.test.setNodeReleases',
    releases,
  )
  await FileSystem.writeFile(`${tmpDir}/.nvmrc`, text)
  await Main.openUri(`${tmpDir}/.nvmrc`)
  await Editor.setCursor(0, text.length)
  await Editor.openCompletion()
}

export const expectCompletionItem = async (
  { expect, Locator }: TestApi,
  index: number,
  label: string,
): Promise<void> => {
  const completions = Locator('#Completions')
  await expect(completions).toBeVisible()
  const completionItems = completions.locator('.EditorCompletionItem')
  const completionItem = completionItems.nth(index)
  await expect(completionItem).toHaveText(label)
}

export const releases = [
  { version: 'v22.11.0' },
  { version: 'v22.10.0' },
  { version: 'v20.18.1' },
  { version: 'v18.20.5' },
  { version: 'v16.20.2' },
]
