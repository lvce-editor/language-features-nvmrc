import type { NodeRelease } from '../NodeReleaseCache/NodeReleaseCache.ts'

const nodeVersionRegex = /^v\d+\.\d+\.\d+$/
const requestedNodeVersionRegex =
  /^v?(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:\.(0|[1-9]\d*))?$/

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

export const hasMatchingVersion = (
  releases: readonly NodeRelease[],
  requestedVersion: string,
): boolean => {
  const match = requestedNodeVersionRegex.exec(requestedVersion)
  if (!match) {
    return false
  }
  const requestedParts = requestedVersion.replace(/^v/, '').split('.')
  return getVersions(releases).some((version) => {
    const releaseParts = version.slice(1).split('.')
    return requestedParts.every((part, index) => part === releaseParts[index])
  })
}

export const hasLtsAlias = (
  releases: readonly NodeRelease[],
  alias: string,
): boolean => {
  const normalizedAlias = alias.toLowerCase()
  return releases.some(
    (release) =>
      typeof release.lts === 'string' &&
      release.lts.toLowerCase() === normalizedAlias,
  )
}
