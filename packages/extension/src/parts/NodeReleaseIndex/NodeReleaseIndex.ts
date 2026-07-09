import type { NodeRelease } from '../NodeReleaseCache/NodeReleaseCache.ts'

const nodeReleaseIndexUrl = 'https://nodejs.org/dist/index.json'

export const fetchNodeReleaseIndex = async (): Promise<readonly NodeRelease[]> => {
  const response = await fetch(nodeReleaseIndexUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch Node.js versions: ${response.status}`)
  }
  const json = await response.json()
  if (!Array.isArray(json)) {
    throw new TypeError('Expected Node.js release index to be an array')
  }
  return json
}

