export interface ICoverageLocation {
  path: string
  format: string
}

export const getFilename = (platform: string, version: string): string => {
  return `test-reporter-${version}-${platform}-amd64`
}

export const getDownloadUrl = (platform: string, version: string): string => {
  return `https://codeclimate.com/downloads/test-reporter/${getFilename(platform, version)}`
}

export const getShasumUrl = (platform: string, version: string): string => {
  return `${getDownloadUrl(platform, version)}.sha256`
}

export const getShasumSigUrl = (platform: string, version: string): string => {
  return `${getShasumUrl(platform, version)}.sig`
}

export const getPublicKeyDownloadUrl = (): string => {
  return 'https://keys.openpgp.org/vks/v1/by-fingerprint/9BD9E2DD46DA965A537E5B0A5CBF320243B6FD85'
}

/**
 * Parses action input to determine is value is true.
 */
export const isTrue = (variable): boolean => {
  const lowercase = variable.toLowerCase()
  return (
    lowercase === '1' ||
    lowercase === 't' ||
    lowercase === 'true' ||
    lowercase === 'y' ||
    lowercase === 'yes'
  )
}

/**
 * Removes 'refs/heads/' prefix.
 */
export const cleanRef = (ref: string): string => {
  return ref.replace(/^refs\/heads\//, '')
}

export const parseCoverageLocations = (locationsPath: string): ICoverageLocation[] => {
  const locations: ICoverageLocation[] = []

  const lines = locationsPath.split(/\r?\n/).filter((x) => x).map((x) => x.trim())
  for (const line of lines) {
    const lineParts = line.split(':')
    const format = lineParts.slice(-1)[0]
    const path = lineParts.slice(0, -1)[0]

    const location: ICoverageLocation = { path, format }
    locations.push(location)
  }

  return locations
}
