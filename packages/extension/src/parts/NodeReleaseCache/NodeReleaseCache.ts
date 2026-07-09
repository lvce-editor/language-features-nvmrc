import * as NodeReleaseIndex from '../NodeReleaseIndex/NodeReleaseIndex.ts'

export interface NodeRelease {
  readonly version?: unknown
}

let cachedReleases: readonly NodeRelease[] | undefined

export const get = async (): Promise<readonly NodeRelease[]> => {
  if (cachedReleases) {
    return cachedReleases
  }
  cachedReleases = await NodeReleaseIndex.fetchNodeReleaseIndex()
  return cachedReleases
}

export const set = (releases: readonly NodeRelease[]): void => {
  cachedReleases = releases
}

export const clear = (): void => {
  cachedReleases = undefined
}

