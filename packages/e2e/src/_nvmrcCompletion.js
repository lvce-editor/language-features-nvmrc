// @ts-check

/**
 * @typedef {import('@lvce-editor/test-with-playwright').TestApi} TestApi
 * @typedef {{ readonly version?: unknown }} NodeRelease
 */

/**
 * @param {Pick<TestApi, 'Command' | 'Editor' | 'FileSystem' | 'Main' | 'Workspace'>} api
 * @param {readonly NodeRelease[]} releases
 * @param {string} [text]
 * @returns {Promise<void>}
 */
export const openNvmrcCompletion = async (
  { Command, Editor, FileSystem, Main, Workspace },
  releases,
  text = '',
) => {
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

/**
 * @param {Pick<TestApi, 'expect' | 'Locator'>} api
 * @param {number} index
 * @param {string} label
 * @returns {Promise<void>}
 */
export const expectCompletionItem = async (
  { expect, Locator },
  index,
  label,
) => {
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
