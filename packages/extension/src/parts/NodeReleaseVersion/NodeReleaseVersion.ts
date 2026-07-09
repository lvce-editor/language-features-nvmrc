import type { NodeRelease } from '../NodeReleaseCache/NodeReleaseCache.ts'

const nodeVersionRegex = /^v\d+\.\d+\.\d+$/

export const getVersions = (
  releases: readonly NodeRelease[],
): readonly string[] => {
  const versions: string[] = []
  const seen = new Set<string>()
  for (const release of releases) {
    if (typeof release.version !== 'string') {
      continue
    }
    if (!nodeVersionRegex.test(release.version)) {
      continue
    }
    if (seen.has(release.version)) {
      continue
    }
    seen.add(release.version)
    versions.push(release.version)
  }
  return versions
}
