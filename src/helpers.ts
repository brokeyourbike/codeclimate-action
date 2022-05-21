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
