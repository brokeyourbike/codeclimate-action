import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import * as openpgp from 'openpgp'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { getPublicKeyDownloadUrl, getShasumSigUrl, getShasumUrl } from './helpers'

export const verifySignature = async (
  filename: string,
  platform: string,
  version: string
): Promise<boolean> => {
  try {
    core.info('Downloading GPG public key..')
    const publicKeyPath = await tc.downloadTool(getPublicKeyDownloadUrl())
    core.info(`GPG public key downloaded to ${publicKeyPath}`)

    core.info('Downloading shasum..')
    const shasumPath = await tc.downloadTool(getShasumUrl(platform, version))
    core.info(`shasum downloaded to ${shasumPath}`)

    core.info('Downloading shasum signature..')
    const shasumSigPath = await tc.downloadTool(getShasumSigUrl(platform, version))
    core.info(`shasum sugnature downloaded to ${shasumSigPath}`)

    const publicKey = fs.readFileSync(publicKeyPath, 'utf-8')
    const shasum = fs.readFileSync(shasumPath, 'utf-8')
    const shasumSig = fs.readFileSync(shasumSigPath)

    core.info('Verifying shasum file..')
    const verified = await openpgp.verify({
      message: await openpgp.createMessage({ text: shasum }),
      signature: await openpgp.readSignature({ binarySignature: shasumSig }),
      verificationKeys: await openpgp.readKeys({ armoredKeys: publicKey })
    })
    const valid = await verified.signatures[0].verified
    if (valid) {
      core.info(`Shasum file signed by key id ${verified.signatures[0].keyID.toHex()}`)
    } else {
      core.setFailed('Error validating shasum signature')
      return false
    }

    const hash = await calculateHash(filename)
    if (hash.trimEnd() === shasum.trimEnd()) {
      core.info(`Reporter shasum verified (${hash})`)
    } else {
      core.setFailed(`Reporter shasum does not match -- uploader hash: ${hash}, public hash: ${shasum}`)
      return false
    }

    return true
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to validate'
    core.setFailed(`Error validating reporter: ${message}`)
    return false
  }
}

const calculateHash = async (filename: string): Promise<string> => {
  const stream = fs.createReadStream(filename)
  const uploaderSha = crypto.createHash('sha256')
  stream.pipe(uploaderSha)

  return await new Promise((resolve, reject) => {
    stream.on('end', () => resolve(`${uploaderSha.digest('hex')}  ${path.basename(filename)}`))
    stream.on('error', reject)
  })
}
