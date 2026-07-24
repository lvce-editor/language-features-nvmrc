import * as NodeReleaseIndex from '../NodeReleaseIndex/NodeReleaseIndex.ts'

export interface NodeRelease {
  readonly lts?: unknown
  readonly version?: unknown
}

const state: {
  releases: readonly NodeRelease[] | undefined
} = {
  releases: undefined,
}

export const get = async (): Promise<readonly NodeRelease[]> => {
  if (state.releases) {
    return state.releases
  }
  state.releases = await NodeReleaseIndex.fetchNodeReleaseIndex()
  return state.releases
}

export const set = (releases: readonly NodeRelease[]): void => {
  state.releases = releases
}

export const clear = (): void => {
  state.releases = undefined
}
